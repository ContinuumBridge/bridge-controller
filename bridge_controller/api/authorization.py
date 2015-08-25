import sys
import operator
import collections
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q, Model
from django.db.models.query import QuerySet
from django.db.models.fields import FieldDoesNotExist
import logging
logger = logging.getLogger('bridge_controller')
from tastypie.authorization import Authorization, ReadOnlyAuthorization
from tastypie.exceptions import Unauthorized

from accounts.models import CBAuth, CBUser
from bridges.models import Bridge


class CBCommonAuthorizationMixin:

    def get_request_bridges(self, bundle):
        requester = CBAuth.objects.get(id=bundle.request.user.id)
        try:
            # Assume user is a human and get bridges associated with it
            bridge_controls = requester.bridge_controls.all()
            bridges = Bridge.objects.filter(controls=bridge_controls)
        except AttributeError:
            # User is a bridge
            bridges = Bridge.objects.filter(pk=requester.pk)
        return bridges

class CBAuthorization(Authorization, CBCommonAuthorizationMixin):

    def get_relation_query(self, related_objects, related, query_list, bundle):

        try:
            bundle.obj._meta.get_field_by_name(related)
            # If related_objects is a queryset, the query should include __in, not so if it is an object
            query_suffix = "__in" if isinstance(related_objects, QuerySet) else ""
            query_list.append((
                 '{0}{1}'.format(related, query_suffix), related_objects
            ))
            return query_list
        except FieldDoesNotExist:
            return query_list

    def get_m2m_relation_query(self, related_objects, m2m_related, query_list, bundle):

        try:
            model = self.resource_meta.queryset.model
            related_through = getattr(model._meta, '{0}_related_through'.format(m2m_related))
            # If related_objects is a queryset, the query should include __in, not so if it is an object
            query_suffix= "__in" if isinstance(related_objects, QuerySet) else ""
            query_list.append((
                 '{0}__{1}{2}'.format(related_through, m2m_related, query_suffix), related_objects
            ))
            return query_list
        except AttributeError:
            return query_list

    def get_client_related_query(self, verb, query_list, bundle):
        requester = CBAuth.objects.get(id=bundle.request.user.id)
        if isinstance(requester, CBUser):
            if verb in getattr(self.resource_meta, 'related_user_permissions', []):
                query_list = self.get_relation_query(requester, 'user', query_list, bundle)
                if verb != 'create':
                    query_list = self.get_m2m_relation_query(requester, 'user', query_list, bundle)

        if verb in getattr(self.resource_meta, 'related_bridge_permissions', []):
            bridges = self.get_request_bridges(bundle)
            query_list = self.get_relation_query(bridges, 'bridge', query_list, bundle)
            query_list = self.get_m2m_relation_query(bridges, 'bridge', query_list, bundle)

        return query_list

    def requester_is_staff(self, bundle):
        requester = CBAuth.objects.get(id=bundle.request.user.id)
        return requester.is_staff

    def filter_with_querylist(self, object_list, query_list, bundle):
        if not isinstance(object_list, QuerySet):
            object_list = getattr(self.resource_meta, 'queryset').filter(id=object_list.id)
        try:
            q_list = [Q(query) for query in query_list]
            allowed = object_list.filter(Q(reduce(operator.or_, q_list))).distinct()
        except TypeError:
            allowed = []
        if self.requester_is_staff(bundle):
            return object_list
        else:
            return allowed

    def test_object_with_querylist(self, object, query_list, bundle):

        # Determines whether an object would be left in a queryset which the query_list was applied to.
        def evaluate_boolean(connector, predicates):
            # Return the result of a list of predicate boolean values being combined with the connector
            try:
                allowed = predicates[0]
            except IndexError:
                # There are no predicates
                return False
            for p in predicates:
                if connector == "OR":
                    allowed = p | allowed
                if connector == "AND":
                    allowed = p & allowed
            return allowed

        # Check if an object conforms to conditions represented in a list of querysets
        def test_relationship(object, relation):
            path = relation[0].split('__')
            related_list = relation[1]
            if not related_list:
                return False
            # If an object is passed, turn it into a list
            if not isinstance(related_list, collections.Iterable):
                related_list = [ related_list ]

            rel = object
            for index, field in enumerate(path):
                try:
                    # Try and filter this field using the remaining path and related_list
                    filtered = rel.filter((
                        '{0}'.format('__'.join(path[index:])), related_list
                    ))
                    return bool(filtered)
                except AttributeError:
                    # Set rel to be the next field/ object in the path
                    try:
                        rel = getattr(rel, field)
                        # Check if this rel is the object we're after
                        if isinstance(rel, related_list[0].__class__) and rel in related_list:
                            return True
                    except AttributeError:
                        return False
            return False

        def evaluate_node(object, node):
            try:
                # node is a query
                evaluated_nodes = []
                for q in node.children:
                    evaluated_nodes.append(evaluate_node(object, q))
                connector = getattr(q, 'connector', 'AND')
                return evaluate_boolean(connector, evaluated_nodes)
            except AttributeError:
                # node is a tuple
                relationship = test_relationship(object, node)
                return relationship

        if not query_list:
            return object

        evaluated_query_list = [ False ]
        for query in query_list:
            evaluated_query_list.append(evaluate_node(object, query))

        return evaluate_boolean('OR', evaluated_query_list)

    def test_list(self, object_list, bundle):
        return object_list

    def get_query_list(self, verb, bundle):
        # Override this
        query_list = []
        return self.get_client_related_query(verb, query_list, bundle)

    def read_list(self, object_list, bundle):
        logger.debug('%s %s client %s', self.__class__.__name__, sys._getframe().f_code.co_name, bundle.request.user.cbid)
        query_list = self.get_query_list('read', bundle)
        filtered = self.filter_with_querylist(object_list, query_list, bundle)
        return self.test_list(filtered, bundle)

    def read_detail(self, object_list, bundle):
        logger.debug('%s %s client %s', self.__class__.__name__, sys._getframe().f_code.co_name, bundle.request.user.cbid)
        query_list = self.get_query_list('read', bundle)
        filtered = self.filter_with_querylist(bundle.obj, query_list, bundle)
        return bool(self.test_list(filtered, bundle))

    def create_list(self, object_list, bundle):
        logger.debug('%s %s client %s', self.__class__.__name__, sys._getframe().f_code.co_name, bundle.request.user.cbid)
        # Assuming they're auto-assigned to ``user``.
        query_list = self.get_query_list('create', bundle)
        filtered = self.filter_with_querylist(bundle.obj, query_list, bundle)
        allowed = self.test_list(filtered, bundle)
        if self.requester_is_staff(bundle):
            return object_list
        else:
            return bool(allowed)

    def create_detail(self, object_list, bundle):

        logger.debug('%s %s client %s', self.__class__.__name__, sys._getframe().f_code.co_name, bundle.request.user.cbid)
        query_list = self.get_query_list('create', bundle)
        # Test the object with the query list, if it passes run test_list, otherwise return false
        allowed = self.test_list([ bundle.obj ], bundle) if self.test_object_with_querylist(bundle.obj, query_list, bundle) \
                    else False

        if self.requester_is_staff(bundle):
            return True
        else:
            return bool(allowed)

    def update_list(self, object_list, bundle):
        logger.debug('%s %s client %s', self.__class__.__name__, sys._getframe().f_code.co_name, bundle.request.user.cbid)
        query_list = self.get_query_list('update', bundle)
        return self.filter_with_querylist(object_list, query_list, bundle)

    def update_detail(self, object_list, bundle):
        logger.debug('%s %s client %s', self.__class__.__name__, sys._getframe().f_code.co_name, bundle.request.user.cbid)
        query_list = self.get_query_list('update', bundle)
        return bool(self.filter_with_querylist(object_list, query_list, bundle))

    def delete_list(self, object_list, bundle):
        logger.debug('%s %s client %s', self.__class__.__name__, sys._getframe().f_code.co_name, bundle.request.user.cbid)
        query_list = self.get_query_list('delete', bundle)
        return self.filter_with_querylist(object_list, query_list, bundle)

    def delete_detail(self, object_list, bundle):
        logger.debug('%s %s client %s', self.__class__.__name__, sys._getframe().f_code.co_name, bundle.request.user.cbid)
        query_list = self.get_query_list('delete', bundle)
        return bool(self.filter_with_querylist(object_list, query_list, bundle))

class CBValidateAuthorization(Authorization, CBCommonAuthorizationMixin):

    def validate(self, object_list, bundle):
        # Override this for resource-specific validation.
        return object_list

    def create_list(self, object_list, bundle):
        logger.debug('%s %s client %s', self.__class__.__name__, sys._getframe().f_code.co_name, bundle.request.user.cbid)
        return self.validate(object_list, bundle)

    def create_detail(self, object_list, bundle):
        logger.debug('%s %s client %s', self.__class__.__name__, sys._getframe().f_code.co_name, bundle.request.user.cbid)
        return bool(self.validate([bundle.obj], bundle))

    def update_list(self, object_list, bundle):
        logger.debug('%s %s client %s', self.__class__.__name__, sys._getframe().f_code.co_name, bundle.request.user.cbid)
        return self.validate(object_list, bundle)

    def update_detail(self, object_list, bundle):
        logger.debug('%s %s client %s', self.__class__.__name__, sys._getframe().f_code.co_name, bundle.request.user.cbid)
        return bool(self.validate([bundle.obj], bundle))

    def delete_list(self, object_list, bundle):
        logger.debug('%s %s client %s', self.__class__.__name__, sys._getframe().f_code.co_name, bundle.request.user.cbid)
        # Sorry user, no deletes for you!
        raise Unauthorized("Sorry, no list deletes.")

    def delete_detail(self, object_list, bundle):
        logger.debug('%s %s client %s', self.__class__.__name__, sys._getframe().f_code.co_name, bundle.request.user.cbid)
        return bool(self.validate([bundle.obj], bundle))


class CBReadAllAuthorization(CBAuthorization):
    """
    Allows bridges to read everything
    """

    def read_list(self, object_list, bundle):
        return object_list

    def read_detail(self, object_list, bundle):
        return True


class StaffAuthorization(ReadOnlyAuthorization):

    def requester_is_staff(self, bundle):
        requester = CBAuth.objects.get(id=bundle.request.user.id)
        return requester.is_staff

    def create_list(self, object_list, bundle):
        if self.requester_is_staff(bundle):
            return object_list
        else:
            return []

    def create_detail(self, object_list, bundle):
        return self.requester_is_staff(bundle)

    def update_list(self, object_list, bundle):
        if self.requester_is_staff(bundle):
            return object_list
        else:
            return []

    def update_detail(self, object_list, bundle):
        return self.requester_is_staff(bundle)

    def delete_list(self, object_list, bundle):
        if self.requester_is_staff(bundle):
            return object_list
        else:
            return []

    def delete_detail(self, object_list, bundle):
        return self.requester_is_staff(bundle)


class AuthAuthorization(ReadOnlyAuthorization):
    """
    Authorization resource used to login clients, bridges and users
    """
    def read_list(self, object_list, bundle):
        # This assumes a ``QuerySet`` from ``ModelResource``.
        raise Unauthorized("You may only post to this endpoint with login or logout appended")

    def read_detail(self, object_list, bundle):
        # Is the requested object owned by the user?
        #return bundle.obj.user == bundle.request.user
        return bundle.obj.id == bundle.request.user.id

    def create_list(self, object_list, bundle):
        raise Unauthorized("You may only post to this endpoint with login or logout appended")
        #return object_list

    def create_detail(self, object_list, bundle):
        raise Unauthorized("You may only post to this endpoint with login or logout appended")

    def delete_list(self, object_list, bundle):
        raise Unauthorized("You may only post to this endpoint with login or logout appended")

    def delete_detail(self, object_list, bundle):
        raise Unauthorized("You may only post to this endpoint with login or logout appended")

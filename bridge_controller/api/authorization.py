import operator
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q
from django.db.models.query import QuerySet
from django.db.models.fields import FieldDoesNotExist
from tastypie.authorization import Authorization, ReadOnlyAuthorization
from tastypie.exceptions import Unauthorized

from accounts.models import CBAuth, CBUser
from bridges.models import Bridge

class CBAuthorization(Authorization):

    def get_relation_query(self, related_objects, related, query_list, bundle):

        try:
            bundle.obj._meta.get_field_by_name(related)
            #bundle.obj.get_field_by_name(related)
            query_list.append((
                 '{0}__in'.format(related), related_objects
            ))
            return query_list
        except FieldDoesNotExist:
            print "Field ", related, " not present"
            return query_list

    def get_m2m_relation_query(self, related_objects, m2m_related, query_list, bundle):

        try:
            related_through = getattr(self.resource_meta, '{0}_related_through'.format(m2m_related))
            print "related_through ", related_through
            query_list.append((
                 '{0}__{1}__in'.format(related_through, m2m_related), related_objects
            ))
            return query_list
            #object_filters.append(Q(**object_filter))
        except AttributeError:
            print "Through relation to ", m2m_related, " not present"
            return query_list

    def get_request_bridges(self, bundle):
        requester = CBAuth.objects.get(id=bundle.request.user.id)
        try:
            # Assume user is a human and get bridges associated with it
            bridge_controls = requester.bridge_controls.all()
            bridges = Bridge.objects.filter(bridge_controls=bridge_controls)
        except AttributeError:
            # User is a bridge
            bridges = []
            bridges.append(requester)
        return bridges

    def get_client_related_query(self, verb, query_list, bundle):
        #print "queryset is ", getattr(self.resource_meta, 'queryset').__class__
        requester = CBAuth.objects.get(id=bundle.request.user.id)
        if isinstance(requester, CBUser):
            if verb in getattr(self.resource_meta, 'related_user_permissions', []):
                query_list = self.get_relation_query([requester], 'user', query_list, bundle)
                query_list = self.get_m2m_relation_query([requester], 'user', query_list, bundle)

        if verb in getattr(self.resource_meta, 'related_bridge_permissions', []):
            bridges = self.get_request_bridges(bundle)
            query_list = self.get_relation_query(bridges, 'bridge', query_list, bundle)
            query_list = self.get_m2m_relation_query(bridges, 'bridge', query_list, bundle)

        return query_list

    def filter_with_querylist(self, object_list, query_list):
        if not isinstance(object_list, QuerySet):
            object_list = getattr(self.resource_meta, 'queryset').filter(id=object_list.id)
        try:
            q_list = [Q(query) for query in query_list]
            return object_list.filter(Q(reduce(operator.or_, q_list))).distinct()
        except TypeError:
            print "TypeError in get_client_related"
            return []

    def get_query_list(self, verb, bundle):
        query_list = []
        return self.get_client_related_query('read', query_list, bundle)
        
    def read_list(self, object_list, bundle):
        # This assumes a ``QuerySet`` from ``ModelResource``.
        query_list = self.get_query_list('read', bundle)
        return self.filter_with_querylist(object_list, query_list)

    def read_detail(self, object_list, bundle):
        #object_set = set()
        #object_set.add(bundle.obj)
        query_list = self.get_query_list('read', bundle)
        return bool(self.filter_with_querylist(bundle.obj, query_list))

    def create_list(self, object_list, bundle):
        # Assuming they're auto-assigned to ``user``.
        requester = CBAuth.objects.get(id=bundle.request.user.id)
        if isinstance(requester, CBUser):
            if 'create' in getattr(self.resource_meta, 'related_user_permissions', []):
                return object_list

    def create_detail(self, object_list, bundle):
        requester = CBAuth.objects.get(id=bundle.request.user.id)
        if isinstance(requester, CBUser):
            return 'create' in getattr(self.resource_meta, 'related_user_permissions', [])
        else:
            return False

    def update_list(self, object_list, bundle):
        allowed = self.get_query_list('update', bundle)
        return allowed

    def update_detail(self, object_list, bundle):
        print "Update objects", object_list
        allowed = self.get_query_list('update', bundle)
        print "Update allowed ", allowed
        return bool(allowed)

    def delete_list(self, object_list, bundle):
        allowed = self.get_query_list('delete', bundle)
        return allowed

    def delete_detail(self, object_list, bundle):
        allowed = self.get_query_list('delete', bundle)
        return bool(allowed)


class CBReadAllAuthorization(CBAuthorization):
    """
    Allows bridges to read everything
    """

    def read_list(self, object_list, bundle):
        return object_list

    def read_detail(self, object_list, bundle):
        return True


class RelatedUserObjectsOnlyAuthorization(Authorization):

    def read_list(self, object_list, bundle):
        # This assumes a ``QuerySet`` from ``ModelResource``.
        # Allow reads of objects which have a through model between themselves and the current user
        filters = {
            '{0}__{1}'.format(self.resource_meta.user_related_through, 'user'): bundle.request.user
        }
        return object_list.filter(**filters)

    def read_detail(self, object_list, bundle):
        # Is the requested object conneced by the specified through model to the user?
        through_model_manager = getattr(bundle.obj, self.resource_meta.user_related_through)
        return through_model_manager.filter(user=bundle.request.user).exists()

    def create_list(self, object_list, bundle):
        # Assuming they're auto-assigned to ``user``.
        return object_list

    def create_detail(self, object_list, bundle):

        # Create a through model of specified type between this one and the current user
        through_model_manager = getattr(bundle.obj, self.resource_meta.user_related_through)
        creation_parameters = {
            '{0}'.format(self.resource_meta.resource_name): bundle.obj,
            '{0}'.format('user'): bundle.request.user
        }
        through_model = through_model_manager.create(**creation_parameters)
        #through_model.save()
        return True
        #return through_model_manager.filter(user=bundle.request.user).exists()
        #return bundle.obj.user == bundle.request.user

    def update_list(self, object_list, bundle):
        allowed = []

        # Since they may not all be saved, iterate over them.
        for obj in object_list:
            through_model_manager = getattr(obj, self.resource_meta.user_related_through)
            if through_model_manager.filter(user=bundle.request.user).exists():
                allowed.append(obj)

        return allowed

    def update_detail(self, object_list, bundle):
        through_model_manager = getattr(bundle.obj, self.resource_meta.user_related_through)
        return through_model_manager.filter(user=bundle.request.user).exists()
        #return bundle.obj.user == bundle.request.user

    def delete_list(self, object_list, bundle):
        allowed = []

        # Since they may not all be deleted, iterate over them.
        for obj in object_list:
            through_model_manager = getattr(obj, self.resource_meta.user_related_through)
            if through_model_manager.filter(user=bundle.request.user).exists():
                allowed.append(obj)

        return allowed
        #raise Unauthorized("Sorry, no deletes.")

    def delete_detail(self, object_list, bundle):
        through_model_manager = getattr(bundle.obj, self.resource_meta.user_related_through)
        return through_model_manager.filter(user=bundle.request.user).exists()
        #raise Unauthorized("Sorry, no deletes.")


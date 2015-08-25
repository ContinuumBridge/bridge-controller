import logging
logger = logging.getLogger('bridge_controller')
from tastypie.authorization import Authorization, ReadOnlyAuthorization
from tastypie.exceptions import Unauthorized

#from bridge_controller.api.authorization import AbstractClientObjectsOnlyAuthorization

class CurrentUserAuthorization(Authorization):

    def read_list(self, object_list, bundle):
        logger.debug('%s %s client %s', self.__class__.__name__, sys._getframe().f_code.co_name, bundle.request.user.cbid)

        # This assumes a ``QuerySet`` from ``ModelResource``.
        #raise Unauthorized("You may only GET details.")
        return object_list.filter(id=bundle.request.user.id)

    def read_detail(self, object_list, bundle):
        logger.debug('%s %s client %s, object id %s', self.__class__.__name__,
                     sys._getframe().f_code.co_name, bundle.request.user.cbid, bundle.obj.id)
        # Is the requested object owned by the user?
        return bundle.obj.id == bundle.request.user.id

    '''
    def create_list(self, object_list, bundle):
        # Assuming their auto-assigned to ``user``.
        return object_list

    def create_detail(self, object_list, bundle):
        return bundle.obj.user == bundle.request.user
    '''

    def update_list(self, object_list, bundle):

        logger.debug('%s %s client %s', self.__class__.__name__, sys._getframe().f_code.co_name, bundle.request.user.cbid)
        allowed = []

        # Since they may not all be saved, iterate over them.
        for obj in object_list:
            if obj == bundle.request.user:
                allowed.append(obj)

        return allowed

    def update_detail(self, object_list, bundle):
        logger.debug('%s %s client %s', self.__class__.__name__, sys._getframe().f_code.co_name, bundle.request.user.cbid)
        return bundle.obj == bundle.request.user

    def delete_list(self, object_list, bundle):
        logger.debug('%s %s client %s', self.__class__.__name__, sys._getframe().f_code.co_name, bundle.request.user.cbid)
        # Sorry user, no deletes for you!
        raise Unauthorized("Sorry, no deletes.")

    def delete_detail(self, object_list, bundle):
        logger.debug('%s %s client %s', self.__class__.__name__, sys._getframe().f_code.co_name, bundle.request.user.cbid)
        raise Unauthorized("Sorry, no deletes.")

class UserObjectsOnlyAuthorization(Authorization):

    def create_list(self, object_list, bundle):
        logger.debug('%s %s client %s', self.__class__.__name__, sys._getframe().f_code.co_name, bundle.request.user.cbid)
        # Assuming they're auto-assigned to ``user``.
        return object_list


class RelatedUserObjectsOnlyAuthorization(Authorization):

    def read_list(self, object_list, bundle):

        logger.debug('%s %s client %s', self.__class__.__name__, sys._getframe().f_code.co_name, bundle.request.user.cbid)
        # This assumes a ``QuerySet`` from ``ModelResource``.
        # Allow reads of objects which have a through model between themselves and the current user
        filters = {
            '{0}__{1}'.format(self.resource_meta.user_related_through, 'user'): bundle.request.user
        }
        return object_list.filter(**filters)

    def read_detail(self, object_list, bundle):
        logger.debug('%s %s client %s', self.__class__.__name__, sys._getframe().f_code.co_name, bundle.request.user.cbid)
        # Is the requested object connected by the specified through model to the user?
        through_model_manager = getattr(bundle.obj, self.resource_meta.user_related_through)
        return through_model_manager.filter(user=bundle.request.user).exists()

    def create_list(self, object_list, bundle):
        logger.debug('%s %s client %s', self.__class__.__name__, sys._getframe().f_code.co_name, bundle.request.user.cbid)
        # Assuming they're auto-assigned to ``user``.
        return object_list

    def create_detail(self, object_list, bundle):

        logger.debug('%s %s client %s', self.__class__.__name__, sys._getframe().f_code.co_name, bundle.request.user.cbid)
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
        logger.debug('%s %s client %s', self.__class__.__name__, sys._getframe().f_code.co_name, bundle.request.user.cbid)

        allowed = []

        # Since they may not all be saved, iterate over them.
        for obj in object_list:
            through_model_manager = getattr(obj, self.resource_meta.user_related_through)
            if through_model_manager.filter(user=bundle.request.user).exists():
                allowed.append(obj)

        return allowed

    def update_detail(self, object_list, bundle):
        logger.debug('%s %s client %s', self.__class__.__name__, sys._getframe().f_code.co_name, bundle.request.user.cbid)

        through_model_manager = getattr(bundle.obj, self.resource_meta.user_related_through)
        return through_model_manager.filter(user=bundle.request.user).exists()
        #return bundle.obj.user == bundle.request.user

    def delete_list(self, object_list, bundle):
        logger.debug('%s %s client %s', self.__class__.__name__, sys._getframe().f_code.co_name, bundle.request.user.cbid)

        allowed = []

        # Since they may not all be deleted, iterate over them.
        for obj in object_list:
            through_model_manager = getattr(obj, self.resource_meta.user_related_through)
            if through_model_manager.filter(user=bundle.request.user).exists():
                allowed.append(obj)

        return allowed
        #raise Unauthorized("Sorry, no deletes.")

    def delete_detail(self, object_list, bundle):
        logger.debug('%s %s client %s', self.__class__.__name__, sys._getframe().f_code.co_name, bundle.request.user.cbid)

        through_model_manager = getattr(bundle.obj, self.resource_meta.user_related_through)
        return through_model_manager.filter(user=bundle.request.user).exists()
        #raise Unauthorized("Sorry, no deletes.")


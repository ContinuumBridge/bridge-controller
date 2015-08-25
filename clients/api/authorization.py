import logging
logger = logging.getLogger('bridge_controller')

from tastypie.authorization import Authorization, ReadOnlyAuthorization
from tastypie.exceptions import Unauthorized

class ClientObjectsOnlyAuthorization(ReadOnlyAuthorization):

    def read_list(self, object_list, bundle):
        logger.debug('%s %s client %s', self.__class__.__name__, sys._getframe().f_code.co_name, bundle.request.user.cbid)

        # This assumes a ``QuerySet`` from ``ModelResource``.
        return object_list.filter(client=bundle.request.user)

    def read_detail(self, object_list, bundle):
        logger.debug('%s %s client %s', self.__class__.__name__, sys._getframe().f_code.co_name, bundle.request.user.cbid)

        # Is the requested object owned by the user?
        return bundle.obj.client == bundle.request.user

    '''
    def create_list(self, object_list, bundle):
        # Assuming they're auto-assigned to ``user``.
        return object_list

    def create_detail(self, object_list, bundle):
        return bundle.obj.client == bundle.request.user

    def update_list(self, object_list, bundle):
        allowed = []

        # Since they may not all be saved, iterate over them.
        for obj in object_list:
            if obj.client == bundle.request.user:
                allowed.append(obj)

        return allowed

    def update_detail(self, object_list, bundle):
        return bundle.obj.client == bundle.request.user
    '''


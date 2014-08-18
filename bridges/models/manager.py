
from clients.models.manager import ClientModelManager

class BridgeModelManager(ClientModelManager):

    def create_bridge(self, save=False, **extra_fields):

        """
        Creates and saves a Bridge with the given email and password.
        """
        # Call create_client on the parent class
        return super(BridgeModelManager, self).create_client(save=save, **extra_fields)


from clients.models.manager import ClientModelManager

class BridgeModelManager(ClientModelManager):

    def create_bridge(self, save=False, user=False, **extra_fields):

        """
        Creates a bridge, saves it if save is True.
        """
        # Call create_client on the parent class
        return super(BridgeModelManager, self).create_client(save=save, **extra_fields)

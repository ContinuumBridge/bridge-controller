
import json
import uuid

class RawJSON:
    def __init__(self, jstext):
        self._jstext = jstext
    def get_jstext(self):
        return self._jstext

class RawJSONEncoder(json.JSONEncoder):
    def __init__(self, *args, **kwargs):
        json.JSONEncoder.__init__(self, *args, **kwargs)
        self._replacement_map = {}

    def default(self, o):
        if isinstance(o, RawJSON):
            key = uuid.uuid4().hex
            self._replacement_map[key] = o.get_jstext()
            return key
        else:
            return json.JSONEncoder.default(self, o)

    def encode(self, o):
        result = json.JSONEncoder.encode(self, o)
        for k, v in self._replacement_map.iteritems():
             result = result.replace('"%s"' % (k,), v)
        return result

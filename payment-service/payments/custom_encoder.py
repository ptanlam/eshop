import uuid
from json import JSONEncoder


class CustomEncoder(JSONEncoder):
    def default(self, value) -> str:
        if isinstance(value, uuid.UUID):
            return str(value)
        return super(CustomEncoder, self).default(value)

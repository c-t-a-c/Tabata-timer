import os
from typing import Union, Dict, List


DB_PATH = os.path.expanduser('~/Documents/TabataDB.db')


JSON = Union[Dict[str, "JSON"], List["JSON"], str, int]

#string specifying what browser to use (e.g. 'chrome', 'electron', 'edge', 'custom')
MODE = 'chrome'
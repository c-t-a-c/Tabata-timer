import eel
import back.controller
from back.settings import MODE


if __name__ == '__main__':
    eel.init('front')
    eel.start('html/index.html', mode=MODE)
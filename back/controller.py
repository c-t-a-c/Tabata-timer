import json
import eel
from pydantic import ValidationError
from . import db
from . import validators
from .settings import JSON


@eel.expose
def get_all_tabata_programs() -> JSON:
    try:
        rows = db.get_all_programs()
    except Exception:
        rows = db.init_program()
                   
    return json.dumps(rows)


@eel.expose
def get_tabata_program(id: str) -> JSON:
    id = json.loads(id)
    program = db.get_program(int(id))

    return json.dumps(program)


@eel.expose
def save_tabata_program(data: str) -> JSON:
    try:
        prog = validators.Program.parse_raw(data)
    except ValidationError as e:
        return e.json()
    else:
       db.save_program(prog)

    return json.dumps({'response': 'ok'})


@eel.expose
def delete_tabata_program(id: str) -> None:
    id = json.loads(id)
    db.delete_program(int(id))

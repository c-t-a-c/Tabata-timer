import sqlite3
from .settings import DB_PATH

def _concat_data_with_titles(titles: list, values: list) -> list:
    return [dict(zip(titles, row)) for row in values]


def _sql_select(query: str) -> list:
    with sqlite3.connect(DB_PATH) as conn:
        c = conn.cursor()
        c.execute(query)
        titles = list(map(lambda x: x[0], c.description))

        return _concat_data_with_titles(titles, c.fetchall())


def get_program(id: int) -> dict:
    query = 'SELECT * FROM program WHERE id={:d}'.format(id)
    program = _sql_select(query)

    return program[0]


def get_all_programs() -> list:
    programs = _sql_select('SELECT * FROM program') 

    return programs


def save_program(prog: dict) -> None:
    with sqlite3.connect(DB_PATH) as conn:
        cur = conn.cursor()
        if hasattr(prog, 'id'):
            query = '''UPDATE program
                        SET title=?,
                            prepare=?,
                            work=?,
                            rest=?,
                            cycles=?,
                            sets=?,
                            restbetweensets=?
                        WHERE id=?'''
            cur.execute(query, (
                prog.title, prog.prepare, prog.work, prog.rest, prog.cycles, 
                prog.sets, prog.restbetweensets, prog.id))
        else:
            query = '''INSERT INTO program(
                        title, prepare, work, rest, cycles, sets, restbetweensets) 
                        VALUES(?, ?, ?, ?, ?, ?, ?)'''
            cur.execute(query, (
                prog.title, prog.prepare, prog.work, prog.rest, prog.cycles, 
                prog.sets, prog.restbetweensets))


def delete_program(id: int) -> None:
     with sqlite3.connect(DB_PATH) as conn:
        cur = conn.cursor()
        query = 'DELETE FROM program WHERE id=?'
        cur.execute(query, (id,))


def init_program() -> list:
    """Loading data on the first start of the program"""
    with sqlite3.connect(DB_PATH) as conn:
        c = conn.cursor()

        c.execute('''CREATE TABLE IF NOT EXISTS program(
            id integer PRIMARY KEY AUTOINCREMENT,
            title text NOT NULL UNIQUE,
            prepare integer,
            work integer, 
            rest integer,
            cycles integer,
            sets integer, 
            restbetweensets integer)''')

        c.execute('''INSERT INTO program(
            title, prepare, work, rest, cycles, sets, restbetweensets) 
            VALUES("Default", 10, 20, 20, 10, 1, 60)''')
        
        conn.commit()

    return _sql_select('SELECT * FROM program')
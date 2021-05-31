import os
name_proj = "Tabata-timer"
noconsole = "--windowed "
onefile = "--onefile "
icon = f"--icon=front{os.path.sep}media{os.path.sep}favicon.ico"

if __name__ == "__main__":
    cmd_txt = f'python -m eel main.py front {onefile} {noconsole} {icon} --name {name_proj}'
    os.system(cmd_txt)
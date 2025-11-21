import subprocess

def remove_package(package):
    try:
        result = subprocess.getoutput(f"sudo apt remove -y {package}")
        return result
    except Exception as e:
        return str(e)


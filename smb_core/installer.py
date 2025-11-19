import subprocess

def install_package(package):
    try:
        result = subprocess.getoutput(f"sudo apt install -y {package}")
        return result
    except Exception as e:
        return str(e)

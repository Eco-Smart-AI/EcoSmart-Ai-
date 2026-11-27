"""
PythonAnywhere WSGI Configuration File
======================================
In your PythonAnywhere Web Tab -> WSGI configuration file, paste this:
"""

import os
import sys

# Lock threads to 1 before importing anything
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["OPENBLAS_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"

# Replace 'yourusername' with your actual PythonAnywhere username
project_home = "/home/yourusername/ecosmart_backend"
if project_home not in sys.path:
    sys.path.insert(0, project_home)

from flask_app import app as application  # noqa

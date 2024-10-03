import sys
import os

# Add the sdk directory to sys.path
sdk_dir = os.path.dirname(os.path.abspath(__file__))
print(sdk_dir)
sys.path.append(sdk_dir)

# Import necessary modules
from .client import *  # Importing all from client for example


import sys
print("Python interpreter:", sys.executable)
try:
    import playwright
    print("Playwright is installed!")
except ImportError as e:
    print("Playwright is NOT installed:", e)

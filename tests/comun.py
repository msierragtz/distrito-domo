"""Rutas y navegador compartidos por las pruebas."""
import os
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BUILD=os.path.join(ROOT,'build')
os.makedirs(os.path.join(BUILD,'capturas'),exist_ok=True)
# Chromium: el de la variable CHROME, o el que trae Playwright
CHROME=os.environ.get('CHROME') or ('/opt/pw-browsers/chromium-1243/chrome-linux64/chrome' if os.path.exists('/opt/pw-browsers/chromium-1243/chrome-linux64/chrome') else None)
def lanzar(p):
  return p.chromium.launch(executable_path=CHROME) if CHROME else p.chromium.launch()

@echo off
rem Paleidzia svetaine siame kompiuteryje ir atidaro narsykleje.
rem Uzdarius si juoda langa, svetaine sustoja.
cd /d "%~dp0"
start "" http://localhost:8080
node serveris.js

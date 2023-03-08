from rake_nltk import Rake

r = Rake(language="spanish") # Uses stopwords for english from NLTK, and all puntuation characters.

r.extract_keywords_from_text("""
    Buscamos GERENTE COMERCIAL BILINGÜE.
Administrador de Empresas, Ingeniero Industrial, Mercadeo o afines, con dominio del idioma inglés.
Experiencia en el sector consumo masivo, superior a 4 años en cargos de dirección de ventas y mercadeo, manejo de equipos comerciales, presupuestos, análisis de cifras y cumplimiento de metas de ventas. Trayectoria en los canales de Retail, Grandes Superficies, Institucional y Tradicional, asistencia a ferias internacionales y negociación con clientes.
Salario: $12´000.000. más $3´000.000. variable y rodamiento de $600.000.
Enviar hojas de vida al correo:
    """)

x = r.get_ranked_phrases() 
print(x)
print(len(x))
print("finaliza")
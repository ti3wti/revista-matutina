# 📻 Sistema de Reportes Tango India

Sistema de bitácora en vivo para la **Revista Matutina Tango India**, diseñado para registrar reportes meteorológicos de radioaficionados durante transmisiones en vivo por Facebook.

🔗 **Acceso al sistema:** [ti3wti.github.io/revista-matutina](https://ti3wti.github.io/revista-matutina){:target="_blank"}

---

## Dependencias y requerimientos

- Cuenta en **GitHub** con un repositorio público y **GitHub Pages** habilitado
- **Token de acceso** a GitHub (Fine-grained, con permiso `Contents: Read and Write` sobre el repositorio)
- **API Key de [APRS.fi](https://aprs.fi)** para el seguimiento de estaciones en tiempo real
- **Suscripción XML de [QRZ.com](https://www.qrz.com)** para consulta de datos y fotografías de radioaficionados
- **Worker en [Cloudflare](https://workers.cloudflare.com)** — actúa como proxy para QRZ.com y como intermediario del clima, evitando restricciones CORS y problemas de caché

---

## Características

- Base de datos de radioaficionados siempre actualizada — crece automáticamente con cada nuevo colega que se reporte
- La base de datos está alojada en GitHub y es compartida entre todos los operadores de control
- Al seleccionar un radioaficionado, carga automáticamente su grilla Maidenhead y localidad desde la base de datos
- Si la grilla o localidad no están en la base de datos, las consulta automáticamente en QRZ.com
- Si el colega no está en la base de datos, sus datos (nombre, grilla y localidad) se obtienen automáticamente desde QRZ.com al momento de agregarlo
- Los datos meteorológicos (temperatura, humedad, presión y velocidad del viento) se precargan automáticamente desde open-meteo según la grilla del reportante
- Número de emisión calculado automáticamente según la fecha del día, basado en el calendario histórico de la revista — editable manualmente si es necesario
- Lista de espera para gestionar pile-ups — permite acumular varias estaciones y atenderlas en orden, sin perder el contexto al cambiar de colega
- Ventana pública optimizada para transmisiones en vivo por Facebook, con mapa interactivo en tiempo real
- La ventana pública muestra la fotografía del reportante obtenida automáticamente desde QRZ.com
- La ventana pública muestra la grilla, localidad y distancia desde la estación control al reportante
- Seguimiento APRS en tiempo real de estaciones de radioaficionados
- Datos de propagación HF (índice Kp planetario) con indicación de condición
- Sismos recientes obtenidos desde USGS
- Estadísticas de la emisión en vivo: total de estaciones, duración, temperatura promedio, estación más lejana y zona más activa
- Exportación de bitácora a PDF con estadísticas integradas
- Historial de emisiones consultable, con búsqueda por fecha, operador o número de emisión
- Condiciones meteorológicas de la estación control con actualización cada 5 minutos
- Compatibilidad con múltiples operadores de control — cada uno personaliza su indicativo, nombre, grilla y título de revista
- Datos de clima con corrección de altitud automática según el terreno para mayor precisión
- Desarrollado por [TI3WTI](https://www.qrz.com/db/TI3WTI)

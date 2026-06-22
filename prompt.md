**Contexto y Rol**
Actúa como un arquitecto de software senior especializado en desarrollo de aplicaciones web modernas, con experiencia en gestión de activos culturales y plataformas de catálogo de obras de arte. Debes diseñar una aplicación web profesional, optimizada para uso en móvil, enfocada en la gestión de artistas y sus obras para exposiciones.

**Consulta / Tarea**
Diseñar y especificar una aplicación web de gestión de activos artísticos que permita registrar, organizar y consultar información de múltiples artistas y sus obras, así como generar reportes en PDF sobre exposiciones realizadas.

**Especificaciones Funcionales**

* Aplicación web responsive (mobile-first), usable cómodamente desde dispositivos móviles.
* Interfaz intuitiva, minimalista y fácil de usar (UX amigable para gestores culturales).
* Implementación basada en tecnologías open source.
* Base de datos:

  * Opción 1: Firebase (Firestore).
  * Opción 2: Base de datos local (IndexedDB o SQLite en cliente).

**Gestión de Artistas**

* Crear, editar y eliminar artistas.
* Campos obligatorios:

  * Nombre completo
  * Teléfono
  * Email

**Gestión de Obras**

* Cada artista puede tener múltiples obras asociadas.
* Campos de cada obra:

  * Nombre de la obra
  * Título
  * Año
  * Tipo de obra (pintura, escultura, fotografía, etc.)
  * Dimensiones
  * Descripción opcional

**Gestión de Exposiciones**

* Registrar exposiciones donde participan obras.
* Tipos de eventos:

  * Museos
  * Ferias
  * Exposiciones
* Relacionar obras con eventos y fechas.

**Reportes y Exportación**

* Generación de PDF resumen que incluya:

  * Número total de artistas
  * Número de obras
  * Obras expuestas por año
  * Clasificación por tipo de evento
* Diseño claro y profesional del PDF.

**Requisitos Técnicos**

* Frontend: React, Vue o similar
* Backend opcional (si no se usa Firebase): Node.js
* Arquitectura modular y escalable
* Uso de librerías open source para generación de PDF (ej. jsPDF o PDFKit)
* Soporte offline básico si se usa base de datos local

**Criterios de Calidad**

* Código limpio y mantenible
* Buen rendimiento en móvil
* Navegación fluida
* Validación de datos en formularios
* Escalabilidad para añadir nuevas funcionalidades

**Cómo debe ser la Respuesta**

* Proporcionar arquitectura completa de la aplicación
* Incluir estructura de base de datos
* Definir componentes principales del frontend
* Sugerir stack tecnológico concreto
* Incluir ejemplos de flujos de usuario
* Opcional: incluir wireframes o estructura de pantallas

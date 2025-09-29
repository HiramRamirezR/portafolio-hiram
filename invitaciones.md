# Invitaciones Web

Este es un proyecto para una aplicación web que permite a los usuarios crear y gestionar invitaciones digitales para eventos. La aplicación está construida con un enfoque de JAMstack, utilizando HTML, CSS y JavaScript en el frontend, y funciones serverless de Netlify para el backend.

## ✨ Características

*   **Creación de Invitaciones:** Permite a los usuarios generar invitaciones web personalizadas.
*   **Formulario de Confirmación (RSVP):** Los invitados pueden confirmar su asistencia a través de un formulario.
*   **Integración de Pagos:** Utiliza Stripe para procesar pagos, posiblemente para eventos con costo o para la compra de plantillas de invitación premium.
*   **Backend Serverless:** La lógica del backend, como la creación de sesiones de pago de Stripe y el manejo de webhooks, se gestiona a través de Netlify Functions.
*   **Base de Datos en la Nube:** Integrado con Firebase para el almacenamiento de datos y la configuración.

## 🚀 Stack Tecnológico

*   **Frontend:**
    *   HTML5
    *   CSS3
    *   JavaScript Vainilla
*   **Backend:**
    *   Node.js (a través de Netlify Functions)
*   **Base de Datos / BaaS:**
    *   Firebase
*   **Pagos:**
    *   Stripe
*   **Alojamiento y Despliegue:**
    *   Netlify

## 🚀 Despliegue

El proyecto está configurado para un despliegue continuo en Netlify. Cualquier `push` a la rama principal (`main` o `master`) activará automáticamente una nueva compilación y despliegue del sitio y las funciones.

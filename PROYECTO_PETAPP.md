# 🐾 PetApp — Documento Maestro del Proyecto

> Este documento es la fuente de verdad del proyecto. Contiene la visión completa, arquitectura, módulos, flujos, modelo de datos y stack técnico. Está pensado para ser leído por Claude Code al inicio de cada sesión de trabajo.

---

## 1. VISIÓN GENERAL

**PetApp** es una aplicación mobile (iOS + Android) construida con React Native + Expo. Es una plataforma social centrada en el bienestar animal que unifica en una sola app:

- Búsqueda y reporte de mascotas perdidas/encontradas
- Adopciones y tránsito de animales
- Directorio de veterinarias y hospitales veterinarios
- Marketplace de negocios y servicios para mascotas

**Principio clave:** el usuario final no paga nada. La monetización es B2B (negocios y veterinarias que pagan suscripción mensual para aparecer en la app) + un porcentaje de las propinas procesadas.

---

## 2. STACK TÉCNICO

### Frontend (Mobile)
- **Framework:** React Native con Expo (SDK más reciente)
- **Lenguaje:** TypeScript
- **Navegación:** Expo Router (file-based routing)
- **Estado global:** Zustand
- **UI Components:** Custom + NativeWind (Tailwind para RN)
- **Mapas:** react-native-maps (Google Maps / Apple Maps)
- **Formularios:** React Hook Form + Zod (validación)
- **Notificaciones push:** Expo Notifications
- **Imágenes:** Expo Image Picker + Expo Image
- **Pagos:** SDK de MercadoPago (redirección externa)

### Backend
- **Plataforma:** Supabase
  - Auth (Google, Apple, Email/Password)
  - PostgreSQL con extensión PostGIS (geolocalización)
  - Storage (imágenes de mascotas, negocios, etc.)
  - Realtime (mensajería interna)
  - Edge Functions (lógica serverless, webhooks de MercadoPago)

### Inteligencia Artificial
- **Identificación de mascotas en fotos:** Google Cloud Vision API o OpenAI GPT-4 Vision
  - Extrae: especie, raza estimada, colores predominantes, tamaño estimado
  - Se usa al subir una foto en el formulario de "encontré una mascota" y "perdí mi mascota"
  - El resultado es sugerido al usuario, quien puede corregirlo antes de publicar

### Servicios externos
- **Mapas:** Google Maps Platform (Maps SDK + Geocoding API)
- **Pagos/Propinas:** MercadoPago Checkout (redirección externa)
- **Push Notifications:** Expo Push Notification Service
- **Analytics:** PostHog (self-hosted o cloud, gratuito para empezar)

---

## 3. MÓDULOS DE LA APP

### 3.1 Autenticación
- Registro e inicio de sesión con: Google, Apple, Email + contraseña
- Perfil de usuario: foto, nombre, zona aproximada (no dirección exacta)
- Privacidad: el número de teléfono y datos personales nunca se muestran públicamente

### 3.2 Mapa Principal (Home)
- Vista de mapa como pantalla principal
- Pins diferenciados visualmente:
  - 🔴 Mascota perdida
  - 🟢 Mascota encontrada
  - 🟡 En adopción
- Filtros disponibles:
  - Tipo de pin (perdido / encontrado / adopción)
  - Especie (perro, gato, otro)
  - Distancia (5km, 10km, 25km, 50km, sin límite)
  - Fecha de publicación
- Al tocar un pin: bottom sheet con resumen de la publicación
- Botón flotante (FAB): "Reportar mascota" → abre el flujo de creación

### 3.3 Mascotas Perdidas

#### Flujo A — "Perdí a mi mascota"
1. El usuario abre el formulario de reporte
2. Sube foto(s) de su mascota (opcional pero recomendado)
3. La IA analiza la foto y sugiere: especie, raza, colores, tamaño
4. El usuario confirma o corrige los datos sugeridos
5. Completa: nombre de la mascota, fecha de pérdida, última ubicación vista (mapa interactivo), descripción adicional
6. Elige si la publicación es anónima o no
7. Publica → aparece en el mapa como pin rojo
8. La app busca en la base de datos mascotas encontradas que hagan match y muestra sugerencias
9. El sistema envía notificaciones push si aparece un nuevo match en el futuro

#### Flujo B — "Encontré una mascota"
1. El usuario abre el formulario de reporte
2. Sube foto del animal encontrado (paso opcional/omitible)
3. La IA analiza la foto y sugiere: especie, raza, colores, tamaño
4. El usuario confirma o corrige los datos sugeridos
5. Completa: ubicación donde lo encontró (mapa interactivo), descripción adicional
6. Elige si la publicación es anónima o no
7. Publica → aparece en el mapa como pin verde
8. La app busca mascotas perdidas con match y muestra sugerencias

#### Sistema de Matching
- Algoritmo de búsqueda en PostgreSQL/PostGIS:
  - Especie (match exacto)
  - Raza (match exacto o similar)
  - Colores predominantes (match parcial)
  - Geolocalización: radio configurable por el usuario (ej: 10km)
  - Fecha: prioriza publicaciones recientes
- No usa IA para el matching, solo para extracción de atributos de la foto
- El usuario puede ver una lista de "posibles matches" ordenada por relevancia

#### Sistema de Contacto (Anonimato)
1. Usuario A cree que encontró a su mascota → envía "Solicitud de contacto"
2. Usuario B (quien publicó) recibe notificación y acepta o rechaza
3. Si acepta → se abre un chat interno entre ambos
4. En ningún momento se exponen datos personales sin consentimiento
5. Las publicaciones anónimas no muestran el nombre del usuario

#### Cierre del Caso
1. Desde el chat, cualquiera de los dos puede marcar el caso como "resuelto"
2. Se muestra un flujo de finalización:
   - Opción de dejar propina al rescatista (redirige a MercadoPago)
   - Opción de hacer una donación a la app (redirige a MercadoPago)
   - Calificación mutua (1-5 estrellas + comentario opcional)
3. La publicación se marca como resuelta y desaparece del mapa activo (queda en historial)

### 3.4 Adopciones y Tránsito

#### Adopciones
- Refugios registrados pueden crear publicaciones de animales en adopción
- Cada publicación incluye: fotos, nombre, especie, raza, edad, sexo, descripción, estado de salud/vacunas
- Aparecen en el mapa con pin 🟡 y en una sección dedicada de "Adopciones"
- Los usuarios pueden filtrar por especie, edad, zona
- Contacto: el interesado envía una solicitud al refugio, que acepta o rechaza → se abre chat interno
- **Sin costo para refugios ni usuarios — feature social/bien común**

#### Tránsito
- Personas particulares pueden ofrecerse como hogares de tránsito temporal
- El tránsitante crea un perfil con: fotos de su hogar, descripción, qué tipo de animales acepta, disponibilidad
- Refugios y usuarios pueden contactar tránsitantes desde su perfil
- **Sin costo — feature social/bien común**

### 3.5 Directorio de Veterinarias

- Listado + mapa de veterinarias y hospitales veterinarios
- Filtros:
  - Cercanía (radio en km)
  - Atención 24hs
  - Especialidad (clínica general, cirugía, dermatología, etc.)
  - Acepta urgencias
- Perfil de cada veterinaria: fotos, descripción, horarios, datos de contacto, especialidades, reseñas y rating
- Turno / contacto: en V1, redirección a WhatsApp o web del veterinario. En versiones futuras: sistema de turnos in-app
- Consultas a domicilio: si el veterinario lo indica, aparece el badge "A domicilio" en su perfil
- **Monetización: los veterinarios pagan suscripción mensual para aparecer en el directorio**

### 3.6 Marketplace / Directorio de Negocios

- Directorio de negocios relacionados con mascotas:
  - Tiendas de alimento
  - Pet shops
  - Servicios de baño y peluquería
  - Venta de redes para balcones
  - Accesorios y ropa
  - Adiestradores
  - Fotografía de mascotas
  - Otros (categoría abierta)
- Filtros: categoría, zona, rating
- Perfil de cada negocio: fotos, descripción, categoría, datos de contacto, reseñas
- Contacto: WhatsApp, teléfono, o web (externo a la app)
- **Monetización: negocios pagan suscripción mensual (modelo aprox. USD 50/mes)**

### 3.7 Mensajería Interna
- Chat 1 a 1 entre usuarios (se activa solo tras aceptación de solicitud de contacto)
- Implementado con Supabase Realtime
- Soporta: texto, imágenes
- Sin exposición de datos personales
- Al finalizar el caso desde el chat → flujo de cierre (ver 3.3)

### 3.8 Notificaciones Push
- Nuevo match para una publicación activa
- Solicitud de contacto recibida
- Mensaje nuevo en el chat
- Caso marcado como resuelto
- (Futuro) Alertas de mascotas perdidas cerca del usuario

---

## 4. MODELO DE DATOS (Alto Nivel)

### Tablas principales en Supabase (PostgreSQL + PostGIS)

```
users
  id, email, name, avatar_url, phone (privado), created_at

pets_reports
  id, user_id, type (lost | found | adoption), species, breed,
  colors[], size, name, description, last_seen_at,
  location (PostGIS GEOGRAPHY POINT), is_anonymous,
  status (active | resolved), created_at, updated_at

pet_images
  id, report_id, url, is_primary

matches
  id, report_a_id, report_b_id, score, created_at

contact_requests
  id, sender_id, receiver_id, report_id, status (pending | accepted | rejected), created_at

chats
  id, report_id, user_a_id, user_b_id, created_at

messages
  id, chat_id, sender_id, content, type (text | image), created_at

reviews
  id, reviewer_id, reviewed_id, chat_id, rating, comment, created_at

businesses
  id, owner_id, type (vet | petshop | food | grooming | other),
  name, description, address, location (PostGIS GEOGRAPHY POINT),
  phone, whatsapp, website, is_24h, accepts_urgencies,
  subscription_status, created_at

business_images
  id, business_id, url

transit_profiles
  id, user_id, description, accepts_species[], location, is_available, created_at

adoptions
  id, shelter_id (→ users), pet_name, species, breed, age_months,
  sex, description, health_notes, status (available | adopted), created_at
```

---

## 5. ESTRUCTURA DE NAVEGACIÓN

```
(tabs)
├── / → Mapa principal (Home)
├── /search → Búsqueda y filtros avanzados
├── /report → Flujo de reporte (perdido / encontrado)
├── /adoptions → Sección de adopciones y tránsito
├── /directory → Veterinarias y Marketplace
└── /profile → Perfil, mis publicaciones, chats, configuración

(modals / stacks)
├── /report/lost → Formulario "Perdí mi mascota"
├── /report/found → Formulario "Encontré una mascota"
├── /pet/[id] → Detalle de publicación de mascota
├── /chat/[id] → Chat interno
├── /business/[id] → Perfil de negocio o veterinaria
├── /adoption/[id] → Detalle de adopción
└── /auth → Login / Registro
```

---

## 6. MONETIZACIÓN

| Fuente | Modelo | Monto estimado |
|---|---|---|
| Veterinarias en directorio | Suscripción mensual | A definir por mercado |
| Negocios en marketplace | Suscripción mensual | ~USD 50/mes |
| Propinas procesadas | % de cada propina | A definir (ej: 5-10%) |
| Featured listings (futuro) | Pago único o mensual | A definir |

---

## 7. FEATURES POR VERSIÓN

### V1 — MVP
- [ ] Auth (Google, Apple, Email)
- [ ] Mapa principal con pins (perdido / encontrado)
- [ ] Formulario de reporte con IA para extracción de atributos
- [ ] Sistema de matching básico (filtros geoespaciales)
- [ ] Solicitud de contacto + chat interno básico
- [ ] Cierre de caso + propina (MercadoPago externo)
- [ ] Calificación mutua
- [ ] Notificaciones push básicas
- [ ] Adopciones (solo listado, sin mapa)
- [ ] Directorio de veterinarias (sin turnos in-app)

### V2
- [ ] Tránsito
- [ ] Marketplace de negocios
- [ ] Filtros avanzados en mapa
- [ ] Alertas de mascotas perdidas por zona
- [ ] Mejoras en matching con IA

### V3 (futuro)
- [ ] Turnos in-app para veterinarias
- [ ] Featured listings
- [ ] Panel de administración para negocios (métricas, edición de perfil)
- [ ] Posible versión web (React Native Web)

---

## 8. CONVENCIONES DE CÓDIGO

- **Lenguaje:** TypeScript estricto (`strict: true`)
- **Estilos:** NativeWind (clases Tailwind en componentes RN)
- **Estructura de carpetas:**
```
app/                  → Rutas (Expo Router)
components/           → Componentes reutilizables
  ui/                 → Componentes base (Button, Input, Card, etc.)
  features/           → Componentes específicos de cada módulo
hooks/                → Custom hooks
stores/               → Zustand stores
services/             → Llamadas a Supabase y APIs externas
utils/                → Helpers y utilidades
types/                → Tipos TypeScript globales
constants/            → Colores, tamaños, config
assets/               → Imágenes, fuentes, íconos
```
- **Commits:** Conventional Commits (`feat:`, `fix:`, `chore:`, etc.)
- **Variables de entorno:** `.env.local` con Expo's `process.env.EXPO_PUBLIC_*`

---

## 9. CÓMO USAR ESTE DOCUMENTO CON CLAUDE CODE

Al iniciar una sesión de trabajo en Claude Code, proporcionar este documento como contexto con el siguiente mensaje de inicio sugerido:

> "Lee el archivo PROYECTO_PETAPP.md y úsalo como contexto completo del proyecto. Hoy vamos a trabajar en: [módulo o feature específico]."

Este documento debe mantenerse actualizado a medida que el proyecto evoluciona. Cuando se tomen decisiones técnicas importantes o cambien los requerimientos, actualizar las secciones correspondientes.

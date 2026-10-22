# AWS Secure Infrastructure ☁️

Laboratorio práctico para aprender **AWS, Terraform, Infrastructure as Code (IaC) y Cloud Security** mediante la construcción progresiva de una infraestructura segura, automatizada y documentada.

El objetivo es comprender cómo se diseña, despliega y protege una infraestructura cloud, aplicando buenas prácticas desde el principio y documentando las decisiones técnicas, pruebas y errores encontrados.

## 🎯 Objetivos de aprendizaje

- Diseñar y gestionar infraestructura con Terraform (IaC).
- Comprender redes de AWS, IAM y control de acceso.
- Aplicar el principio de mínimo privilegio y otras buenas prácticas de seguridad.
- Automatizar validaciones y tareas repetitivas.
- Detectar y corregir configuraciones inseguras.
- Incorporar controles de seguridad en un flujo CI/CD.

## 🛠️ Tecnologías

- **AWS:** infraestructura y servicios cloud.
- **Terraform:** definición y gestión de infraestructura como código.
- **Git y GitHub:** control de versiones y documentación.
- **GitHub Actions:** automatización del flujo de trabajo.
- **Checkov:** análisis estático de seguridad para infraestructura como código.

## 📍 Estado actual

**Fase 1 — Preparación del entorno**

- [x] Instalar y verificar Terraform, AWS CLI y Git.
- [x] Inicializar el proyecto con `terraform init`.
- [x] Validar la configuración con `terraform validate`.
- [x] Configurar Git y sincronizar el repositorio con GitHub.
- [x] Versionar el archivo `.terraform.lock.hcl`.
- [ ] Configurar y verificar el acceso a AWS.

Todavía no se han desplegado recursos de infraestructura en AWS.

## 🗺️ Roadmap

### Fase 1 — Entorno y fundamentos
- [x] Preparar la configuración inicial de Terraform.
- [x] Organizar el repositorio y el control de versiones.
- [ ] Configurar autenticación segura con AWS.

### Fase 2 — Primera infraestructura
- [ ] Diseñar una arquitectura inicial de bajo coste.
- [ ] Definir recursos con Terraform.
- [ ] Revisar permisos, exposición de red y posibles costes.
- [ ] Validar los cambios antes de desplegarlos.

### Fase 3 — Seguridad
- [ ] Aplicar el principio de mínimo privilegio.
- [ ] Incorporar análisis con Checkov.
- [ ] Documentar riesgos, controles y decisiones de diseño.

### Fase 4 — Automatización
- [ ] Crear un workflow de GitHub Actions.
- [ ] Automatizar `terraform fmt`, `terraform validate` y los análisis de seguridad.
- [ ] Documentar las pruebas y los resultados.

## 🔐 Principios de seguridad

- No guardar credenciales ni secretos en el repositorio.
- Evitar permisos excesivos.
- Revisar los cambios antes de desplegar infraestructura.
- Controlar el estado de Terraform y los posibles costes.
- Documentar los riesgos y las medidas de mitigación.

## 💡 Objetivo final

Construir un laboratorio reproducible que demuestre conocimientos prácticos de **Cloud Engineering, Infrastructure as Code, automatización y Cloud Security**, entendiendo cada componente y justificando las decisiones técnicas.
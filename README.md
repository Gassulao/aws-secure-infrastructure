# AWS Secure Infrastructure ☁️

Laboratorio práctico de **AWS, Terraform, Infrastructure as Code (IaC) y Cloud Security**, desarrollado para construir progresivamente una infraestructura cloud segura, reproducible y documentada.

El objetivo es aprender a diseñar, desplegar y proteger infraestructura en AWS mediante código, aplicando buenas prácticas de seguridad, control de versiones y automatización desde el principio.

## 🎯 Objetivos de aprendizaje

- Diseñar y gestionar infraestructura con Terraform (IaC).
- Comprender redes de AWS, IAM y control de acceso.
- Aplicar el principio de mínimo privilegio.
- Validar y revisar cambios antes de desplegar infraestructura.
- Detectar y corregir configuraciones inseguras.
- Incorporar controles de seguridad en un flujo CI/CD.
- Documentar decisiones técnicas, pruebas y errores encontrados.

## 🛠️ Tecnologías

- **AWS:** infraestructura y servicios cloud.
- **Terraform:** definición y gestión de infraestructura como código.
- **AWS CLI:** interacción con AWS desde la terminal.
- **Git y GitHub:** control de versiones y documentación.
- **GitHub Actions:** automatización del flujo de trabajo (planificado).
- **Checkov:** análisis estático de seguridad para infraestructura como código (planificado).

## 📍 Estado actual

**Fase 2 — Primera infraestructura: red básica desplegada**

La infraestructura inicial se ha definido con Terraform y se está gestionando mediante código.

### Recursos de AWS

| Recurso | Configuración |
|---|---|
| Región | `eu-west-1` |
| VPC | `10.20.0.0/16` |
| Subred pública | `10.20.1.0/24` |
| Subred privada | `10.20.2.0/24` |
| Internet Gateway | Conectado a la VPC |
| Tabla de rutas pública | Ruta predeterminada hacia el Internet Gateway |

La subred pública y la privada están creadas en la zona de disponibilidad `eu-west-1a`. La tabla de rutas pública está asociada a la subred pública.

### Organización de Terraform

- `main.tf`: proveedor y definición de los recursos principales.
- `variables.tf`: variables configurables, como región y bloques CIDR.
- `outputs.tf`: valores de salida de la infraestructura.
- `.terraform.lock.hcl`: versiones bloqueadas de los proveedores.
- `terraform.tfstate`: estado local de Terraform; no debe publicarse en el repositorio.

> La existencia de una subred privada no implica que tenga conectividad de salida a Internet. La configuración de NAT y las rutas privadas se abordará si resulta necesaria para la arquitectura.

### Progreso

- [x] Preparar Terraform, AWS CLI y Git.
- [x] Inicializar el proyecto con `terraform init`.
- [x] Validar la configuración con `terraform validate`.
- [x] Configurar el control de versiones y sincronizar con GitHub.
- [x] Versionar `.terraform.lock.hcl`.
- [x] Crear una VPC y dos subredes.
- [x] Crear y asociar el Internet Gateway.
- [x] Configurar la tabla de rutas pública.
- [x] Separar la configuración en variables y outputs.
- [ ] Revisar y documentar el acceso seguro a AWS y los permisos IAM.
- [ ] Completar la arquitectura y sus controles de seguridad.

## 🗺️ Roadmap

### Fase 1 — Entorno y fundamentos

- [x] Preparar la configuración inicial de Terraform.
- [x] Organizar el repositorio y el control de versiones.
- [x] Configurar el acceso de trabajo a AWS.

### Fase 2 — Primera infraestructura

- [x] Crear la VPC y las subredes pública y privada.
- [x] Configurar el Internet Gateway y el enrutamiento público.
- [x] Parametrizar los bloques CIDR y la región.
- [ ] Revisar la arquitectura y sus rutas de red.
- [ ] Evaluar los costes antes de incorporar nuevos recursos.
- [ ] Completar la arquitectura según los siguientes objetivos del laboratorio.

### Fase 3 — Seguridad

- [ ] Revisar y aplicar permisos IAM de mínimo privilegio.
- [ ] Definir reglas de red restrictivas cuando se incorporen servicios que las necesiten.
- [ ] Incorporar análisis de seguridad con Checkov.
- [ ] Documentar riesgos, controles y decisiones de diseño.
- [ ] Revisar el almacenamiento y la protección del estado de Terraform.

### Fase 4 — Automatización

- [ ] Crear un workflow de GitHub Actions.
- [ ] Automatizar `terraform fmt` y `terraform validate`.
- [ ] Incorporar análisis de seguridad al flujo CI/CD.
- [ ] Revisar los planes de Terraform antes de aplicar cambios.
- [ ] Documentar las pruebas y los resultados.

## 🔐 Principios de seguridad

- No guardar credenciales, tokens ni secretos en el repositorio.
- Utilizar permisos IAM de mínimo privilegio.
- Revisar los planes de Terraform antes de desplegar cambios.
- Mantener el estado de Terraform fuera del repositorio y protegerlo adecuadamente.
- Evaluar los costes antes de crear recursos adicionales.
- Evitar exposiciones innecesarias a Internet.
- Documentar los riesgos, las pruebas y las medidas de mitigación.

## 💡 Objetivo final

Construir un laboratorio reproducible que demuestre conocimientos prácticos de **Cloud Engineering, Terraform, automatización y Cloud Security**, explicando cada componente y justificando las decisiones técnicas.

El proyecto evoluciona de forma incremental: primero se construyen los fundamentos, después se incorporan controles de seguridad y finalmente se automatizan las validaciones y el flujo de trabajo.

# AWS Secure Infrastructure ☁️

Laboratorio práctico de **AWS, Terraform, Infrastructure as Code (IaC) y Cloud Security**, desarrollado para construir progresivamente una infraestructura cloud reproducible, documentada y con controles de seguridad.

El objetivo es aprender a diseñar, desplegar y proteger infraestructura en AWS mediante código, aplicando buenas prácticas de seguridad, control de versiones y automatización.

## 🎯 Objetivos de aprendizaje

- Diseñar y gestionar infraestructura mediante Terraform (IaC).
- Comprender redes de AWS, subredes, tablas de rutas y grupos de seguridad.
- Aplicar el principio de mínimo privilegio en IAM.
- Revisar y validar cambios antes de desplegar infraestructura.
- Identificar y corregir configuraciones inseguras.
- Incorporar análisis de seguridad y controles en CI/CD.
- Documentar decisiones técnicas, pruebas y errores encontrados.

## 🛠️ Tecnologías

- **AWS:** infraestructura y servicios cloud.
- **Terraform:** definición y gestión de infraestructura como código.
- **AWS CLI:** interacción con AWS desde la terminal.
- **Git y GitHub:** control de versiones y documentación.
- **GitHub Actions:** automatización del flujo de trabajo (planificado).
- **Checkov:** análisis estático de seguridad para infraestructura como código (planificado).

## 📍 Estado actual

**Fase 2 — Infraestructura de red y controles iniciales desplegados**

La infraestructura se gestiona mediante Terraform. Actualmente incluye una VPC, dos subredes, un Internet Gateway, tablas de rutas independientes y un Security Group destinado a una futura capa web.

### Recursos desplegados

| Recurso | Configuración |
|---|---|
| Región AWS | `eu-west-1` |
| Zona de disponibilidad | `eu-west-1a` |
| VPC | `10.20.0.0/16` |
| Subred pública | `10.20.1.0/24` |
| Subred privada | `10.20.2.0/24` |
| Internet Gateway | Conectado a la VPC |
| Tabla de rutas pública | Asociada a la subred pública, con ruta predeterminada al Internet Gateway |
| Tabla de rutas privada | Asociada a la subred privada, sin ruta predeterminada a Internet |
| Security Group web | Creado para una futura capa web |
| Regla de entrada HTTP | TCP/80 desde `0.0.0.0/0` |
| Regla de entrada HTTPS | TCP/443 desde `0.0.0.0/0` |

**Importante:** las reglas HTTP y HTTPS permiten conexiones entrantes desde cualquier dirección IPv4. Esto puede ser apropiado para un servicio web público, pero deberá revisarse cuando se despliegue la aplicación. La existencia de estas reglas no implica que haya un servidor web desplegado o accesible.

La subred privada no dispone actualmente de una ruta predeterminada hacia Internet. No se ha configurado un NAT Gateway. La conectividad de salida se evaluará cuando la arquitectura lo requiera.

### Organización de Terraform

- `main.tf`: definición del proveedor y los recursos principales.
- `variables.tf`: parámetros configurables, como región y bloques CIDR.
- `outputs.tf`: valores de salida de la infraestructura.
- `.terraform.lock.hcl`: versiones bloqueadas de los proveedores.
- `terraform.tfstate`: estado local de Terraform; debe mantenerse fuera del repositorio y protegerse adecuadamente.

El estado de Terraform es necesario para relacionar los recursos declarados en el código con los recursos administrados en AWS. No debe publicarse ni compartirse sin las medidas de protección adecuadas.

### Progreso

- [x] Preparar Terraform, AWS CLI y Git.
- [x] Inicializar el proyecto con `terraform init`.
- [x] Validar la configuración con `terraform validate`.
- [x] Configurar Git y sincronizar con GitHub.
- [x] Versionar `.terraform.lock.hcl`.
- [x] Crear la VPC y las subredes pública y privada.
- [x] Crear y conectar el Internet Gateway.
- [x] Configurar la tabla de rutas pública.
- [x] Crear y asociar la tabla de rutas privada.
- [x] Separar la configuración en variables y outputs.
- [x] Crear el Security Group web.
- [x] Añadir reglas de entrada HTTP y HTTPS.
- [ ] Revisar las reglas de entrada y salida del Security Group.
- [ ] Documentar y ajustar los permisos IAM de mínimo privilegio.
- [ ] Revisar la protección del estado de Terraform.
- [ ] Incorporar análisis de seguridad de la infraestructura.

## 🗺️ Roadmap

### Fase 1 — Entorno y fundamentos

- [x] Preparar el entorno de Terraform.
- [x] Organizar el repositorio y el control de versiones.
- [x] Configurar el acceso de trabajo a AWS.

### Fase 2 — Infraestructura de red

- [x] Crear la VPC y las subredes pública y privada.
- [x] Configurar el Internet Gateway y el enrutamiento público.
- [x] Crear la tabla de rutas privada y asociarla a su subred.
- [x] Parametrizar la región y los bloques CIDR.
- [x] Crear el Security Group para la futura capa web.
- [ ] Revisar las rutas y las reglas de red.
- [ ] Evaluar los costes antes de añadir nuevos recursos.

### Fase 3 — Seguridad cloud

- [ ] Revisar los permisos IAM y aplicar mínimo privilegio.
- [ ] Revisar las reglas de entrada y salida de los grupos de seguridad.
- [ ] Definir las reglas de red necesarias para cada servicio.
- [ ] Incorporar análisis estático con Checkov.
- [ ] Documentar riesgos, controles y decisiones de diseño.
- [ ] Revisar el almacenamiento y la protección del estado de Terraform.

### Fase 4 — Automatización DevSecOps

- [ ] Crear un workflow de GitHub Actions.
- [ ] Automatizar `terraform fmt` y `terraform validate`.
- [ ] Incorporar análisis de seguridad al flujo CI/CD.
- [ ] Revisar los planes de Terraform antes de aplicar cambios.
- [ ] Documentar las pruebas y sus resultados.

### Fase 5 — Evolución de la arquitectura

- [ ] Evaluar los componentes necesarios para desplegar una aplicación web.
- [ ] Diseñar la conectividad entre los componentes públicos y privados.
- [ ] Definir los controles de acceso y monitorización necesarios.
- [ ] Documentar el despliegue, la validación y la limpieza de recursos.

Las fases futuras se implementarán de forma incremental, evaluando su necesidad, seguridad y coste antes de desplegarlas.

## 🔐 Principios de seguridad

- No guardar credenciales, tokens ni secretos en el repositorio.
- Utilizar permisos IAM de mínimo privilegio.
- Revisar `terraform plan` antes de desplegar cambios.
- Mantener el estado de Terraform fuera del repositorio y protegerlo adecuadamente.
- Evaluar los costes antes de crear recursos adicionales.
- Evitar exposiciones innecesarias a Internet.
- Limitar el acceso de red a los puertos y orígenes que realmente se necesiten.
- Documentar los riesgos, las pruebas y las medidas de mitigación.
- Revisar el estado real de los recursos en AWS después de aplicar cambios.

## 💡 Objetivo final

Construir un laboratorio reproducible que demuestre conocimientos prácticos de **Cloud Engineering, Terraform, automatización y Cloud Security**, explicando cada componente y justificando las decisiones técnicas.

El proyecto evoluciona de forma incremental: primero se construyen los fundamentos de red, después se incorporan controles de seguridad y finalmente se automatizan las validaciones y el flujo de trabajo.
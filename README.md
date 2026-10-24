# AWS Secure Infrastructure ☁️

Laboratorio práctico de **AWS, Terraform, Infrastructure as Code (IaC) y Cloud Security**, desarrollado para construir progresivamente una infraestructura cloud reproducible, documentada y con controles de seguridad.

El objetivo es aprender a diseñar, desplegar y proteger infraestructura en AWS mediante código, aplicando buenas prácticas de seguridad, control de versiones, automatización y gestión de costes.

## 🎯 Objetivos de aprendizaje

- Diseñar y gestionar infraestructura mediante Terraform (IaC).
- Comprender redes de AWS, subredes, tablas de rutas y grupos de seguridad.
- Aplicar el principio de mínimo privilegio en IAM.
- Revisar y validar cambios antes de desplegar infraestructura.
- Identificar y corregir configuraciones inseguras.
- Aprender a desplegar y administrar instancias EC2.
- Incorporar análisis de seguridad y controles en CI/CD.
- Documentar decisiones técnicas, pruebas y errores encontrados.
- Controlar los costes de los recursos desplegados en AWS.

## 🛠️ Tecnologías

- **AWS:** infraestructura y servicios cloud.
- **Terraform:** definición y gestión de infraestructura como código.
- **AWS CLI:** interacción con AWS desde la terminal.
- **Git y GitHub:** control de versiones y documentación.
- **GitHub Actions:** automatización del flujo de trabajo (planificado).
- **Checkov:** análisis estático de seguridad para infraestructura como código (planificado).
- **Ubuntu Server 24.04 LTS:** sistema operativo de la instancia EC2.

## 📍 Estado actual

**Fase 3 — Primera instancia EC2 desplegada; revisión de seguridad y acceso pendiente.**

La infraestructura se gestiona mediante Terraform. Se ha desplegado la red base y una instancia EC2 en la subred pública. La instancia se encuentra actualmente detenida (`stopped`) para reducir los costes de computación.

La creación de la instancia se completó correctamente mediante `terraform apply`, con un resultado de un recurso añadido, cero modificados y cero destruidos.

### Recursos desplegados

| Recurso | Configuración |
|---|---|
| Región AWS | `eu-west-1` |
| Zona de disponibilidad | `eu-west-1a` para las subredes existentes |
| VPC | `10.20.0.0/16` |
| Subred pública | `10.20.1.0/24` |
| Subred privada | `10.20.2.0/24` |
| Internet Gateway | Conectado a la VPC |
| Tabla de rutas pública | Asociada a la subred pública, con ruta predeterminada al Internet Gateway |
| Tabla de rutas privada | Asociada a la subred privada, sin ruta predeterminada a Internet |
| Security Group web | `terraform-secure-lab-web-sg` |
| Regla de entrada HTTP | TCP/80 desde `0.0.0.0/0` |
| Regla de entrada HTTPS | TCP/443 desde `0.0.0.0/0` |
| Instancia EC2 | `terraform-secure-lab-web` |
| ID de instancia | `i-0178928ffdac7aeb5` |
| Sistema operativo | Ubuntu Server 24.04 LTS |
| Tipo de instancia | `t3.micro` |
| Disco raíz | 8 GB EBS gp3, cifrado |
| Protección de metadatos | IMDSv2 obligatorio |
| Estado actual de EC2 | `stopped` |

**Importante:** las reglas HTTP y HTTPS permiten conexiones entrantes desde cualquier dirección IPv4. Esto puede ser apropiado para un servicio web público, pero deberá revisarse cuando se despliegue la aplicación. Actualmente no se ha instalado ni validado un servidor web.

La subred privada no dispone de una ruta predeterminada hacia Internet. No se ha configurado un NAT Gateway.

La instancia EC2 dispone de una IP pública mientras está en ejecución y puede recibir una IP pública diferente cuando vuelva a arrancarse. Las direcciones observadas durante la sesión fueron:

- IP pública: `108.131.109.142`
- IP privada: `10.20.1.224`

Estas direcciones corresponden a la consulta realizada durante la sesión y no deben considerarse permanentes.

### Configuración de seguridad de EC2

La instancia se ha definido en Terraform con las siguientes medidas:

- Disco raíz cifrado mediante EBS.
- Eliminación del disco raíz al terminar la instancia (`delete_on_termination = true`).
- Uso obligatorio de tokens IMDSv2 para acceder a los metadatos.
- Asociación al Security Group de la capa web.
- Etiquetas para identificar el entorno, el propietario de la gestión y la función del recurso.

Todavía queda pendiente configurar y validar un método seguro de administración de la instancia. No se ha abierto SSH a Internet y no se ha confirmado acceso mediante AWS Systems Manager.

## 🧱 Organización de Terraform

- `main.tf`: definición del proveedor y los recursos principales.
- `variables.tf`: parámetros configurables, como región y bloques CIDR.
- `outputs.tf`: valores de salida de la infraestructura.
- `.terraform.lock.hcl`: versiones bloqueadas de los proveedores.
- `terraform.tfstate`: estado local de Terraform; debe mantenerse fuera del repositorio y protegerse adecuadamente.

El estado de Terraform relaciona los recursos declarados en el código con los recursos administrados en AWS. No debe publicarse ni compartirse sin las medidas de protección adecuadas.

## 🧪 Validaciones y operaciones realizadas

Durante la sesión se han utilizado los siguientes comandos:

| Comando | Objetivo |
|---|---|
| `terraform fmt` | Formatear los archivos de configuración |
| `terraform validate` | Comprobar la validez de la configuración |
| `terraform plan` | Revisar los cambios propuestos antes de aplicarlos |
| `terraform apply` | Crear la instancia EC2 |
| `aws ec2 describe-security-groups` | Consultar las reglas del Security Group |
| `aws ec2 describe-images` | Consultar imágenes de sistema disponibles |
| `aws ec2 describe-instance-types` | Consultar las características de `t3.micro` |
| `aws ec2 describe-instances` | Comprobar el estado y las direcciones de la instancia |
| `aws ec2 stop-instances` | Solicitar la detención de la instancia |

La instancia se creó con éxito y posteriormente se confirmó su estado `stopped`.

### Incidencias de permisos IAM

Durante el despliegue se detectaron errores de autorización:

- `ec2:RunInstances`: inicialmente faltaba autorización para lanzar la instancia.
- `iam:ListAttachedUserPolicies`: el usuario de laboratorio no podía consultar las políticas administradas asociadas.
- `ec2:StopInstances`: la primera solicitud de parada fue rechazada por falta de autorización.

La creación y la parada de la instancia se completaron posteriormente.

La política consultada, denominada `TerraformLabReadOnly`, contiene permisos de lectura y permisos de gestión de recursos de red. Por tanto, su nombre no refleja completamente su alcance actual.

**Pendiente:** revisar y documentar los permisos IAM efectivos, aplicar mínimo privilegio y separar los permisos de consulta, despliegue y administración de instancias cuando sea posible.

## ✅ Progreso

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
- [x] Crear una instancia EC2 Ubuntu mediante Terraform.
- [x] Configurar el disco raíz cifrado y los metadatos IMDSv2.
- [x] Revisar el plan antes de crear la instancia.
- [x] Comprobar el estado y las IP de la instancia.
- [x] Detener la instancia al terminar la sesión.
- [ ] Revisar las reglas de entrada y salida del Security Group.
- [ ] Documentar y ajustar los permisos IAM de mínimo privilegio.
- [ ] Revisar la protección del estado de Terraform.
- [ ] Configurar un método seguro de administración de EC2.
- [ ] Instalar y validar un servidor web.
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
- [x] Crear el Security Group para la capa web.
- [ ] Revisar las rutas y las reglas de red.
- [ ] Evaluar los costes antes de añadir nuevos recursos.

### Fase 3 — EC2 y seguridad cloud

- [x] Desplegar una instancia EC2 Ubuntu mediante Terraform.
- [x] Configurar almacenamiento EBS cifrado.
- [x] Exigir tokens IMDSv2.
- [x] Verificar el estado de la instancia.
- [x] Detener la instancia para reducir el coste de computación.
- [ ] Revisar los permisos IAM y aplicar mínimo privilegio.
- [ ] Configurar un método seguro de administración.
- [ ] Revisar las reglas de entrada y salida del Security Group.
- [ ] Instalar y probar un servidor web.
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
- Detener o eliminar los recursos de laboratorio cuando no sean necesarios, comprobando previamente las consecuencias sobre los datos y el estado de Terraform.

## 💰 Control de costes

El laboratorio utiliza créditos promocionales de AWS, por lo que el coste debe revisarse durante todo el desarrollo.

- La instancia EC2 se encuentra actualmente detenida.
- El almacenamiento EBS continúa existiendo y puede seguir generando costes.
- Otros recursos, incluida la dirección IPv4 pública según su estado, pueden generar cargos.
- No se ha creado un NAT Gateway.
- Antes de incorporar servicios adicionales, se revisarán sus costes y su necesidad para el aprendizaje.

Los créditos promocionales están sujetos a las condiciones y la fecha de caducidad indicadas en AWS Billing.

## 💡 Objetivo final

Construir un laboratorio reproducible que demuestre conocimientos prácticos de **Cloud Engineering, Terraform, automatización y Cloud Security**, explicando cada componente y justificando las decisiones técnicas.

El proyecto evoluciona de forma incremental: primero se construyen los fundamentos de red, después se incorporan máquinas virtuales y controles de seguridad, y finalmente se automatizan las validaciones y el flujo de trabajo.

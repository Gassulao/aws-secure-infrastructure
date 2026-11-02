# AWS Secure Infrastructure ☁️

Mi laboratorio personal para aprender **AWS, DevOps, Cloud Engineering e Infrastructure as Code (IaC)** mediante la construcción progresiva de una infraestructura cloud real.

Estoy desarrollando este proyecto para aprender a diseñar, desplegar, administrar y automatizar recursos en AWS. Mi intención es entender cómo funciona cada componente, trabajar con herramientas utilizadas en entornos profesionales y documentar los pasos, problemas y soluciones que vaya encontrando.

Quiero construir una base sólida de Cloud y DevOps. La seguridad cloud también formará parte del proyecto, pero la iré incorporando progresivamente una vez tenga consolidados los fundamentos de infraestructura, automatización y despliegue.

---

## 🎯 Objetivos de aprendizaje

Con este laboratorio quiero adquirir experiencia práctica en:

- Diseñar y gestionar infraestructura mediante Terraform (IaC).
- Comprender las redes de AWS, VPC, subredes, tablas de rutas y Security Groups.
- Desplegar y administrar instancias EC2.
- Administrar servidores Linux y trabajar desde terminal.
- Utilizar AWS CLI para consultar y gestionar recursos.
- Administrar instancias mediante AWS Systems Manager.
- Desplegar servicios web utilizando Nginx.
- Gestionar el código y los cambios mediante Git y GitHub.
- Automatizar tareas mediante Bash y Python.
- Aprender Docker y el funcionamiento de los contenedores.
- Crear pipelines de integración y despliegue continuo (CI/CD).
- Incorporar progresivamente monitorización, observabilidad y buenas prácticas de seguridad.
- Documentar decisiones técnicas, comandos, errores y soluciones.
- Comprender y controlar los costes de los recursos desplegados en AWS.

## 🛠️ Tecnologías

### Tecnologías utilizadas actualmente

- **AWS:** infraestructura y servicios cloud.
- **Terraform:** definición y gestión de infraestructura como código.
- **AWS CLI:** interacción con AWS desde la terminal.
- **AWS Systems Manager (SSM):** administración remota de instancias EC2.
- **Session Manager Plugin:** conexión desde Windows mediante SSM.
- **Git y GitHub:** control de versiones y documentación.
- **Ubuntu Server 24.04 LTS:** sistema operativo de la instancia EC2.
- **Nginx:** servidor web instalado y configurado en EC2.
- **HTML y CSS:** desarrollo de la página web del laboratorio.
- **Bash:** trabajo interactivo y ejecución de comandos en Linux.

### Tecnologías previstas

- **GitHub Actions:** automatización del flujo de trabajo y pipelines CI/CD.
- **Docker:** creación y ejecución de contenedores.
- **Python:** automatización y desarrollo de herramientas.
- **Checkov:** análisis estático de configuraciones Terraform.
- **Terraform remoto:** gestión centralizada y protegida del estado.

---

## 📍 Estado actual

**Fase actual — Infraestructura AWS desplegada, acceso remoto validado y servidor web publicado.**

He construido una infraestructura inicial en AWS mediante Terraform y he desplegado una instancia EC2 con Ubuntu Server 24.04 LTS.

También he configurado el acceso remoto mediante AWS Systems Manager Session Manager, evitando la necesidad de habilitar SSH en la instancia.

Después de validar el acceso a Ubuntu, he instalado Nginx, comprobado que el servidor web funciona y sustituido la página de bienvenida por una página HTML personalizada para presentar el proyecto.

Actualmente puedo acceder a la web desde un navegador utilizando la IP pública de la instancia.

### Recursos desplegados

| Recurso | Configuración |
|---|---|
| Cuenta AWS | `172155958881` |
| Región AWS | `eu-west-1` |
| Zona de disponibilidad | `eu-west-1a` para las subredes existentes |
| Perfil AWS CLI | `terraform-lab` |
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
| Estado EC2 | `running` en la última comprobación |
| IP pública observada | `54.195.147.88` |
| IP privada observada | `10.20.1.224` |

Las direcciones IP pueden cambiar cuando detengo y vuelvo a iniciar la instancia. Por tanto, no considero la IP pública dinámica como una dirección permanente.

**Importante:** las reglas HTTP y HTTPS permiten conexiones entrantes desde cualquier dirección IPv4. Esto permite publicar el servidor web, pero revisaré las reglas y su alcance conforme evolucione el laboratorio.

La subred privada no dispone de una ruta predeterminada hacia Internet. No he configurado un NAT Gateway.

### Configuración de EC2

He desplegado la instancia con las siguientes características:

- Ubuntu Server 24.04 LTS.
- Tipo de instancia `t3.micro`.
- Disco raíz EBS gp3 cifrado de 8 GB.
- Eliminación del disco raíz al terminar la instancia (`delete_on_termination = true`).
- Uso obligatorio de tokens IMDSv2.
- Asociación al Security Group de la capa web.
- Etiquetas para identificar el entorno y la función del recurso.
- Administración remota mediante AWS Systems Manager.

No he habilitado SSH ni abierto el puerto 22 para administrar la instancia.

### Configuración IAM para Systems Manager

Para permitir que AWS Systems Manager administre la instancia, he utilizado la siguiente estructura:

| Elemento | Nombre |
|---|---|
| Rol IAM | `EC2-SSM-Lab-Role` |
| Instance Profile | `EC2-SSM-Lab-Profile` |
| Política administrada de AWS | `AmazonSSMManagedInstanceCore` |

El rol utiliza una relación de confianza que permite a EC2 asumirlo mediante el servicio `ec2.amazonaws.com`.

La política `AmazonSSMManagedInstanceCore` proporciona los permisos necesarios para que el agente SSM de la instancia pueda comunicarse con Systems Manager.

He comprobado que:

- El rol existe y tiene la relación de confianza correcta.
- La política `AmazonSSMManagedInstanceCore` está asociada al rol.
- El Instance Profile contiene el rol correcto.
- La instancia EC2 tiene asociado `EC2-SSM-Lab-Profile`.

### Configuración de Systems Manager

He comprobado el registro y la comunicación de la instancia con AWS Systems Manager mediante:

```powershell
aws ssm describe-instance-information --region eu-west-1 --profile terraform-lab --query "InstanceInformationList[].[InstanceId,PingStatus,PlatformName,AgentVersion]" --output table
```

Resultado obtenido:

| Instance ID | Ping Status | Platform | Agent Version |
|---|---|---|---|
| `i-0178928ffdac7aeb5` | `Online` | Ubuntu | `3.3.4793.0` |

El estado `Online` confirma que AWS Systems Manager reconoce la instancia y que el agente está comunicándose correctamente.

### Acceso remoto mediante Session Manager

He validado una conexión interactiva desde Windows utilizando AWS CLI:

```powershell
aws ssm start-session --target i-0178928ffdac7aeb5 --region eu-west-1 --profile terraform-lab
```

La conexión se inició correctamente y me permitió acceder a la terminal de Ubuntu.

Para finalizar la sesión utilizo:

```bash
exit
```

Esto cierra la sesión remota y devuelve el control a PowerShell en Windows.

**Resultado:** tengo acceso remoto a Ubuntu mediante SSM, sin necesidad de SSH ni de abrir el puerto 22.

### Instalación de Session Manager Plugin en Windows

Para que AWS CLI pueda abrir sesiones interactivas, instalé el Session Manager Plugin en mi equipo local.

Descarga oficial:

https://s3.amazonaws.com/session-manager-downloads/plugin/latest/windows/SessionManagerPluginSetup.exe

Pasos realizados:

1. Descargar `SessionManagerPluginSetup.exe`.
2. Ejecutar el instalador de Windows.
3. Completar la instalación.
4. Comprobar la existencia del ejecutable.

Ruta comprobada:

```text
C:\Program Files\Amazon\SessionManagerPlugin\bin\session-manager-plugin.exe
```

Comprobación:

```powershell
Test-Path "C:\Program Files\Amazon\SessionManagerPlugin\bin\session-manager-plugin.exe"
```

Resultado:

```text
True
```

También comprobé que el ejecutable funcionaba invocándolo directamente:

```powershell
& "C:\Program Files\Amazon\SessionManagerPlugin\bin\session-manager-plugin.exe"
```

El programa devolvió:

```text
The Session Manager plugin was installed successfully. Use the AWS CLI to start a session.
```

Inicialmente PowerShell no reconocía `session-manager-plugin` como comando porque no encontraba el ejecutable mediante el PATH. Comprobé que estaba instalado y utilicé su ruta completa. Posteriormente AWS CLI consiguió iniciar la sesión correctamente.

---

## 🌐 Servidor web: Nginx

Una vez validado el acceso remoto a la instancia EC2, he empezado a trabajar con la administración de servicios Linux y el despliegue de aplicaciones web.

He elegido Nginx para publicar la primera página web del laboratorio.

### Instalación

Primero actualicé la información de los paquetes:

```bash
sudo apt update
```

Después instalé Nginx:

```bash
sudo apt install nginx -y
```

También ejecuté una actualización de paquetes:

```bash
sudo apt upgrade
```

Durante este proceso se actualizó el paquete `libbrotli1`.

### Comprobación del servicio

Comprobé que Nginx estaba iniciado y habilitado para arrancar con el sistema.

Para consultar el estado de forma sencilla:

```bash
systemctl is-active nginx
```

Resultado:

```text
active
```

También utilicé:

```bash
systemctl status nginx
```

Este comando muestra información más detallada del servicio. Puede abrir un paginador, por lo que utilizo `q` para salir de esa pantalla.

### Comprobación HTTP local

Antes de probar el acceso desde Internet, comprobé que Nginx respondía desde la propia instancia:

```bash
curl -I http://localhost
```

Resultado obtenido:

```text
HTTP/1.1 200 OK
Server: nginx/1.24.0 (Ubuntu)
Content-Type: text/html
Content-Length: 615
```

La respuesta `200 OK` confirmó que Nginx estaba sirviendo contenido correctamente.

### Primera publicación desde Internet

Después abrí la IP pública de la instancia desde mi navegador:

```text
http://54.195.147.88
```

La página de bienvenida de Nginx se mostró correctamente.

Esto me permitió comprobar el recorrido completo de una petición web:

```text
Navegador
    |
    v
IP pública de EC2
    |
    v
Internet Gateway
    |
    v
Security Group (TCP/80)
    |
    v
EC2 - Ubuntu Server
    |
    v
Nginx
    |
    v
Contenido HTML
```

He aprendido que Nginx no necesita estar conectado de forma especial a AWS: se ejecuta dentro del sistema operativo de la instancia EC2. AWS proporciona la infraestructura y la conectividad, mientras que Nginx recibe las peticiones web y sirve el contenido.

### Página HTML personalizada

Después de comprobar la página predeterminada, he creado una página HTML personalizada para presentar el laboratorio.

La ubicación utilizada es:

```text
/var/www/html/index.html
```

Esta carpeta es el directorio web predeterminado de Nginx en Ubuntu.

Para editar la página utilizo:

```bash
sudo nano /var/www/html/index.html
```

Nano me permite editar el contenido directamente desde la terminal.

Atajos utilizados:

| Combinación | Función |
|---|---|
| `Ctrl + O` | Guardar el archivo |
| `Enter` | Confirmar el nombre |
| `Ctrl + X` | Salir del editor |

La página personalizada presenta el proyecto desde una perspectiva de Cloud y DevOps, mostrando su infraestructura, tecnologías y evolución.

La página se ha guardado y he comprobado que se visualiza correctamente desde la IP pública de EC2.

### Validación y recarga de Nginx

Cuando modifico la configuración de Nginx, puedo comprobarla con:

```bash
sudo nginx -t
```

Si la configuración es válida, el resultado esperado incluye:

```text
syntax is ok
test is successful
```

Para aplicar cambios de configuración sin reiniciar completamente el servicio:

```bash
sudo systemctl reload nginx
```

**Estado actual:** Nginx está instalado y funcionando, y mi página HTML personalizada se puede visualizar desde el navegador a través de la IP pública.

---

## 🖥️ Administración Linux y terminal

Durante el trabajo con Systems Manager he aprendido a administrar Ubuntu directamente desde la terminal.

La sesión inicial de SSM se abría utilizando `sh`. Sin embargo, al trabajar con el terminal observé que las teclas de navegación no se comportaban como esperaba.

### Diferencia entre sh y Bash

He comprobado que Bash ya estaba instalado en Ubuntu:

```bash
bash --version
```

La versión observada fue:

```text
GNU bash, version 5.2.21(1)-release
```

Para iniciar Bash desde la sesión SSM utilizo:

```bash
bash
```

He comprobado que dentro de Bash funcionan correctamente las flechas del teclado para moverme por los comandos.

También he tenido que ajustar el carácter de borrado de Backspace en la terminal:

```bash
stty erase '^H'
```

Este ajuste funciona en la sesión actual. Todavía no he configurado el inicio automático de Bash al conectarme mediante SSM.

**Aprendizaje:** `sh` y Bash son intérpretes de comandos diferentes. Bash ofrece funcionalidades interactivas que facilitan el trabajo diario, mientras que `sh` suele utilizarse cuando se busca compatibilidad con el estándar POSIX.

---

## 🧱 Organización de Terraform

Estoy organizando la configuración de Terraform para mantener el proyecto separado por responsabilidades.

- `main.tf`: definición del proveedor y los recursos principales.
- `variables.tf`: parámetros configurables, como región y bloques CIDR.
- `outputs.tf`: valores de salida de la infraestructura.
- `.terraform.lock.hcl`: versiones bloqueadas de los proveedores.
- `terraform.tfstate`: estado local de Terraform; debe mantenerse fuera del repositorio y protegerse adecuadamente.

El estado de Terraform relaciona los recursos declarados en el código con los recursos administrados en AWS.

No debo publicar el estado ni compartirlo sin las medidas de protección adecuadas.

Una de las siguientes tareas será revisar la gestión del rol IAM y del Instance Profile para decidir cómo mantener esos recursos bajo una gestión coherente desde Terraform.

---

## 🧪 Validaciones y operaciones realizadas

Durante el desarrollo he utilizado los siguientes comandos:

| Comando | Para qué lo utilizo |
|---|---|
| `terraform init` | Inicializar Terraform |
| `terraform fmt` | Formatear los archivos de configuración |
| `terraform validate` | Comprobar la validez de la configuración |
| `terraform plan` | Revisar los cambios propuestos antes de desplegar |
| `terraform apply` | Aplicar la configuración y crear recursos |
| `aws ec2 describe-security-groups` | Consultar las reglas del Security Group |
| `aws ec2 describe-images` | Consultar imágenes de sistema disponibles |
| `aws ec2 describe-instance-types` | Consultar las características de `t3.micro` |
| `aws ec2 describe-instances` | Consultar el estado y las direcciones de la instancia |
| `aws ec2 start-instances` | Iniciar una instancia detenida |
| `aws ec2 stop-instances` | Detener una instancia |
| `aws iam get-instance-profile` | Consultar el Instance Profile y el rol asociado |
| `aws iam list-attached-role-policies` | Consultar las políticas asociadas a un rol |
| `aws ec2 describe-iam-instance-profile-associations` | Consultar asociaciones de perfiles IAM en EC2 |
| `aws ec2 associate-iam-instance-profile` | Asociar un Instance Profile a una instancia |
| `aws ec2 disassociate-iam-instance-profile` | Desasociar un Instance Profile |
| `aws ssm describe-instance-information` | Consultar las instancias administradas por SSM |
| `aws ssm start-session` | Abrir una sesión remota mediante SSM |
| `sudo apt update` | Actualizar la información de paquetes |
| `sudo apt install nginx -y` | Instalar Nginx |
| `systemctl is-active nginx` | Consultar si Nginx está activo |
| `curl -I http://localhost` | Comprobar la respuesta HTTP local |
| `sudo nginx -t` | Validar la configuración de Nginx |
| `sudo systemctl reload nginx` | Recargar la configuración de Nginx |
| `sudo nano /var/www/html/index.html` | Editar la página web |
| `bash --version` | Consultar la versión de Bash |
| `stty -a` | Consultar la configuración de la terminal |

---

## ⚠️ Incidencias y soluciones

Quiero documentar los problemas que me encuentro porque forman parte del aprendizaje y pueden servirme como referencia cuando vuelva a trabajar con estos servicios.

### 1. Permisos para iniciar la instancia EC2

Al intentar arrancar la instancia se obtuvo:

```text
UnauthorizedOperation:
not authorized to perform ec2:StartInstances
```

La política `TerraformLabReadOnly` no incluía inicialmente `ec2:StartInstances`.

Se añadió la acción a su bloque de permisos de gestión de recursos y se comprobó mediante IAM Policy Simulator.

Después de resolver la autorización, el comando de inicio funcionó correctamente.

### 2. Asociación del Instance Profile

La primera asociación del perfil IAM permaneció durante un tiempo en estado `associating`.

Consulté el estado mediante:

```powershell
aws ec2 describe-iam-instance-profile-associations --filters "Name=instance-id,Values=i-0178928ffdac7aeb5" --region eu-west-1 --profile terraform-lab
```

Desasocié la asociación inicial y volví a asociar el perfil.

Finalmente, `describe-instances` confirmó que la instancia mostraba el ARN del Instance Profile esperado.

### 3. Permiso de consulta de Systems Manager

Al ejecutar:

```powershell
aws ssm describe-instance-information --region eu-west-1 --profile terraform-lab
```

Se obtuvo inicialmente:

```text
AccessDeniedException:
not authorized to perform ssm:DescribeInstanceInformation
```

Se añadió `ssm:DescribeInstanceInformation` a `TerraformLabReadOnly`, con `Resource: "*"`.

Aunque el permiso aparecía en la versión predeterminada de la política, el error persistió durante un tiempo. Finalmente, después de esperar, el comando funcionó y la instancia apareció como `Online`.

**Aprendizaje:** los cambios de permisos IAM pueden tardar en reflejarse. No conviene modificar repetidamente una política sin comprobar primero el resultado de la evaluación y dar tiempo a que los cambios se propaguen.

### 4. Permisos para abrir y finalizar sesiones SSM

Al intentar abrir una sesión aparecieron errores relacionados con:

```text
ssm:StartSession
ssm:TerminateSession
```

Se añadieron las acciones correspondientes a la política de permisos del usuario de laboratorio.

La autorización de SSM debe distinguirse de los permisos del rol de la instancia: el rol EC2 permite que el agente se comunique con AWS, mientras que el usuario IAM necesita autorización para iniciar y gestionar sesiones.

### 5. Session Manager Plugin no encontrado

AWS CLI devolvió:

```text
SessionManagerPlugin is not found.
```

Se comprobó que el ejecutable existía en:

```text
C:\Program Files\Amazon\SessionManagerPlugin\bin\session-manager-plugin.exe
```

Se verificó su funcionamiento mediante la ruta completa.

La instalación del plugin es necesaria en el ordenador desde el que inicio la sesión; no es una instalación que deba realizarse dentro de Ubuntu.

Finalmente, AWS CLI consiguió abrir una sesión interactiva y validé el acceso a Ubuntu.

### 6. Backspace no borraba correctamente en SSM

Al utilizar la terminal de SSM, Backspace mostraba `^H` en lugar de borrar el carácter.

Consulté la configuración de la terminal:

```bash
stty -a
```

Observé que el carácter de borrado estaba configurado como `^?`.

Lo corregí para la sesión actual con:

```bash
stty erase '^H'
```

Después comprobé que Backspace funcionaba correctamente.

### 7. Las flechas del teclado no funcionaban en sh

Al utilizar las flechas del teclado en la sesión inicial de SSM aparecían secuencias de escape como:

```text
^[OA
^[OB
^[OC
^[OD
```

Comprobé que Bash estaba instalado:

```bash
bash --version
```

Al ejecutar:

```bash
bash
```

Las flechas empezaron a funcionar correctamente para navegar y editar comandos.

Por ahora utilizo Bash manualmente al iniciar la sesión SSM. No he configurado todavía su inicio automático.

### 8. Salida de systemctl status

Al ejecutar:

```bash
systemctl status nginx
```

La terminal puede mostrar una pantalla paginada con el texto `(END)`.

Para salir de esa pantalla utilizo:

```text
q
```

También puedo consultar directamente el estado del servicio con:

```bash
systemctl is-active nginx
```

Este último comando devuelve `active` cuando el servicio está funcionando y evita abrir el paginador.

### 9. Comandos y salidas mezclados en la terminal

Durante las primeras pruebas llegué a pegar texto de salida de comandos directamente en la terminal.

Esto produjo errores del tipo:

```text
sh: ... not found
```

Aprendí a distinguir entre los comandos que ejecuto y las salidas que devuelve Linux. No debo volver a pegar una salida como si fuese un comando.

### 10. Página de bienvenida de Nginx

Después de instalar Nginx, comprobé que se mostraba su página de bienvenida predeterminada.

Localicé el directorio web:

```text
/var/www/html/
```

Y creé mi propia página:

```text
/var/www/html/index.html
```

La guardé desde Nano y comprobé que se visualizaba desde el navegador mediante la IP pública de EC2.

**Resultado:** he sustituido la página de bienvenida por una página personalizada para presentar el laboratorio.

---

## 📊 Progreso

### Infraestructura AWS

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

### Administración y acceso remoto

- [x] Crear el rol IAM para la instancia.
- [x] Crear el Instance Profile.
- [x] Asociar el Instance Profile a la EC2.
- [x] Asociar `AmazonSSMManagedInstanceCore` al rol.
- [x] Comprobar el estado `Online` de SSM.
- [x] Instalar Session Manager Plugin en Windows.
- [x] Validar una conexión interactiva mediante SSM.
- [x] Comprobar la salida de la sesión con `exit`.
- [x] Acceder a Bash desde SSM.
- [x] Corregir el comportamiento de Backspace en la sesión actual.

### Servidor web

- [x] Instalar Nginx en Ubuntu.
- [x] Comprobar que el servicio está activo.
- [x] Validar la respuesta HTTP local mediante `curl`.
- [x] Acceder al servidor desde Internet mediante la IP pública.
- [x] Crear una página HTML personalizada.
- [x] Publicar la página mediante Nginx.
- [x] Comprobar que la página se visualiza desde el navegador.

### Pendiente

- [ ] Revisar las reglas de entrada y salida del Security Group.
- [ ] Revisar y documentar los permisos IAM de mínimo privilegio.
- [ ] Revisar la protección del estado de Terraform.
- [ ] Revisar la gestión del Instance Profile desde Terraform.
- [ ] Automatizar la instalación y configuración de Nginx.
- [ ] Revisar la estructura y organización de los archivos Terraform.
- [ ] Evaluar la posibilidad de utilizar un dominio propio.
- [ ] Configurar HTTPS cuando corresponda.
- [ ] Incorporar análisis de seguridad de la infraestructura.

---

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

### Fase 3 — EC2 y administración Linux

- [x] Desplegar una instancia EC2 Ubuntu mediante Terraform.
- [x] Configurar almacenamiento EBS cifrado.
- [x] Exigir tokens IMDSv2.
- [x] Verificar el estado de la instancia.
- [x] Configurar el rol IAM y el Instance Profile.
- [x] Asociar `AmazonSSMManagedInstanceCore`.
- [x] Registrar y validar la instancia en Systems Manager.
- [x] Instalar Session Manager Plugin en Windows.
- [x] Validar el acceso remoto mediante Session Manager.
- [x] Aprender a trabajar con Bash dentro de SSM.
- [ ] Revisar los permisos IAM y aplicar mínimo privilegio.
- [ ] Revisar las reglas de entrada y salida del Security Group.

### Fase 4 — Servidor web y despliegue

- [x] Instalar Nginx en Ubuntu.
- [x] Comprobar el funcionamiento del servidor web.
- [x] Publicar una página HTML personalizada.
- [x] Comprobar el acceso desde Internet.
- [ ] Automatizar el despliegue de la página.
- [ ] Gestionar la configuración de Nginx de forma reproducible.
- [ ] Evaluar la compra y configuración de un dominio.
- [ ] Configurar HTTPS.

### Fase 5 — Infrastructure as Code y automatización

- [ ] Revisar y completar la gestión de recursos mediante Terraform.
- [ ] Organizar variables, outputs y módulos.
- [ ] Gestionar el estado de Terraform de forma remota.
- [ ] Automatizar la instalación de paquetes y servicios.
- [ ] Crear scripts Bash para tareas repetitivas.
- [ ] Explorar automatizaciones con Python.

### Fase 6 — CI/CD

- [ ] Crear un workflow de GitHub Actions.
- [ ] Automatizar `terraform fmt` y `terraform validate`.
- [ ] Revisar los planes de Terraform antes de aplicar cambios.
- [ ] Automatizar validaciones del código.
- [ ] Diseñar un proceso de despliegue reproducible.
- [ ] Documentar las pruebas y sus resultados.

### Fase 7 — Contenedores y evolución cloud

- [ ] Aprender Docker.
- [ ] Crear y ejecutar contenedores.
- [ ] Desplegar una aplicación utilizando contenedores.
- [ ] Explorar servicios adicionales de AWS.
- [ ] Explorar servicios equivalentes en Azure.
- [ ] Incorporar monitorización y observabilidad.

### Fase 8 — Seguridad y buenas prácticas

- [ ] Revisar los permisos IAM de mínimo privilegio.
- [ ] Incorporar análisis estático con Checkov.
- [ ] Añadir controles de seguridad al pipeline CI/CD.
- [ ] Revisar la exposición de servicios y puertos.
- [ ] Documentar riesgos, controles y decisiones de diseño.

Las fases futuras se implementarán de forma incremental. Antes de desplegar nuevos recursos, revisaré su utilidad, complejidad y coste.

---

## 🔐 Buenas prácticas que quiero aplicar

A medida que avance el laboratorio, quiero incorporar estas prácticas:

- No guardar credenciales, tokens ni secretos en el repositorio.
- Utilizar permisos IAM de mínimo privilegio.
- Revisar `terraform plan` antes de desplegar cambios.
- Mantener el estado de Terraform fuera del repositorio y protegerlo adecuadamente.
- Evaluar los costes antes de crear recursos adicionales.
- Evitar exposiciones innecesarias a Internet.
- Limitar el acceso de red a los puertos y orígenes que realmente necesite.
- Evitar abrir SSH si existe una alternativa de administración adecuada.
- Utilizar Systems Manager para administrar las instancias cuando sea posible.
- Documentar los riesgos, las pruebas y las decisiones técnicas.
- Revisar el estado real de los recursos en AWS después de aplicar cambios.
- Detener o eliminar los recursos de laboratorio cuando no sean necesarios, comprobando previamente las consecuencias sobre los datos y el estado de Terraform.

---

## 💰 Control de costes

Estoy utilizando créditos promocionales de AWS para desarrollar este laboratorio, por lo que quiero controlar los costes durante todo el proceso.

Algunos aspectos que debo tener en cuenta:

- La instancia EC2 en ejecución puede generar cargos de computación.
- El almacenamiento EBS puede seguir generando costes aunque detenga la instancia.
- Las direcciones IPv4 públicas y otros servicios pueden generar cargos.
- No he creado un NAT Gateway.
- Antes de incorporar nuevos servicios, revisaré sus costes y su utilidad para el aprendizaje.

Los créditos promocionales están sujetos a las condiciones y a la fecha de caducidad indicadas en AWS Billing.

---

## 📖 Documentación del proyecto

Quiero que este repositorio refleje tanto el resultado final como el proceso de aprendizaje.

Por eso estoy documentando:

- Los comandos que utilizo y para qué sirve cada uno.
- La configuración de los recursos de AWS.
- Los archivos y bloques de Terraform.
- Los errores que aparecen y cómo los soluciono.
- Las pruebas que realizo para comprobar que los servicios funcionan.
- Las decisiones técnicas que tomo durante el desarrollo.
- Las nuevas tecnologías que incorporo.

Mi intención es que otra persona pueda entender cómo he construido el laboratorio y que yo mismo pueda consultar los pasos cuando necesite repetirlos.

---

## 💡 Objetivo final

Quiero construir un laboratorio cloud reproducible que me permita demostrar conocimientos prácticos de **Cloud Engineering, DevOps, Terraform, Linux, automatización y CI/CD**.

No busco únicamente tener recursos desplegados en AWS. Quiero entender cómo se conectan entre sí, cómo se administran, cómo se automatizan y cómo puedo mantenerlos de forma ordenada.

Empezaré consolidando los fundamentos de infraestructura y despliegue, después incorporaré automatización y contenedores, y finalmente ampliaré el laboratorio con monitorización y controles de seguridad.

**Building my own cloud infrastructure, one step at a time.**

Repositorio: [AWS Secure Infrastructure — GitHub](https://github.com/Gassulao/aws-secure-infrastructure)
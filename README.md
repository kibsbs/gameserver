# Gameserver
![Discord Shield](https://discordapp.com/api/guilds/1101926320465772574/widget.png?style=shield)

**Gameserver** is a centralized server specifically designed for **Wii**, providing efficient management of a diverse range of essential services, including JMCS, WDF, and Galaxy. This powerful server acts as the core infrastructure, responsible for coordinating and overseeing these critical components, ensuring optimal performance and seamless integration within the DanceParty ecosystem.

It's important to note that the Gameserver should not be confused with our repository, **KrystalUDP**, which focuses on handling UDP connections for online services of PlayStation 3, Xbox 360, and Wii U. The Gameserver and KrystalUDP serve distinct purposes and cater to different platforms within our comprehensive online infrastructure.

## Sub-services

- **JMCS** (Jean Mich Central Server):
JMCS takes charge of numerous essential services, including leaderboards, user profiles, online maps, and the JD Wall. It serves as the core backend system responsible for managing and facilitating these functionalities, enhancing the overall user experience.

- **WDF** (World Dance Floor):
WDF is responsible for the management of various World Dance Floor data, encompassing playlists, status updates, and parties. It serves as the central hub for handling and organizing these crucial elements of the World Dance Floor experience.

- **NAS** (Nintendo Authentication Server):
NAS handles authentication tokens from the Wii console. We developed a custom NAS instead of using Wiimmfi due to the limitations of their token payload, which did not meet the requirements of our system.

- **Tracking**:
Tracking plays a crucial role in identifying issues, bugs, and gathering information sent by the game. However, we currently lack detailed information on how the API of Tracking is intended to function, which hinders its optimal performance. As a result, the tracking functionality may not be operating at its full capacity and may require further development and refinement.

- ~~**Galaxy**~~:
Galaxy was initially designed to handle the distribution and storage of the song database for both JMCS and WDF. However, we have made the decision to remove Galaxy from the repository as it is no longer in active use. Alternative solutions have been implemented to fulfill the role that Galaxy previously served, ensuring efficient song management and storage within JMCS and WDF.

### Requirements

- Node.JS *(version 18 or higher)*
- PM2 *(install via NPM)*
	### Databases
	- MongoDB
	- Memcached
  
### Installation and Usage

To install and use the Gameserver, follow these steps:

```shell
git clone https://github.com/DancePartyOnline/gameserver.git
cd gameserver
npm install
pm2 start ecosystem.json
```

The above code block will clone the server repository, install all required modules, and start all services in `ecosystem.json` with PM2.

### Using the Command Line

If you prefer not to run the server with PM2 or want to run a specific service, you can use the command line interface.

```shell
gameserver.js <command>

Commands:
	gameserver.js serve <service> Initialize a service

Options:
	--help Show help [boolean]
	--version Show version number [boolean]
	-e, --env Service environment [string]
	-p, --port Port to bind on [number]
```

### Examples

- `node src\gameserver.js serve jmcs --env local`: Start JMCS in the local environment.
- `node src\gameserver.js serve wdf --env dev --port 5000`: Start WDF in the development environment, binding to port 5000.

## Changelog

For a detailed list of changes, refer to our [changelog](https://github.com/dancepartyonline/gameserver/blob/main/CHANGELOG.md).

## Contribute

We welcome contributions to enhance our services, solutions, and workflow. Feel free to contribute!

import gql from 'graphql-tag';

export const Query = {
	isAuth: gql`
		query {
			isAuth {
				error
			}
		}
	`,
	getConnections: gql`
		query {
			getConnections {
				connectionName
				connectAuto
				notify
				id
			}
		}
	`,
	getDevices: gql`
		query {
			getDevices {
				id
				info
			}
		}
	`,
	getInfoUser: gql`
		query {
			getInfoUser {
				name
				email
				lastname
				urlPhoto
				lastLogin
				direction
			}
		}
	`,
	getRules: gql`
		query {
			getRules {
				idDB
				comparison
				number
				topic
				message
				state
			}
		}
	`,
	getToken: gql`
		query {
			getToken {
				message
			}
		}
	`,
	getEnabledTelegram: gql`
		query {
			getEnabledTelegram {
				error
			}
		}
	`,
};

export const Mutation = {
	Login: gql`
		mutation($email: String!, $password: String!) {
			loginUser(email: $email, password: $password) {
				error
				message
				token
			}
		}
	`,
	Register: gql`
		mutation(
			$email: String!
			$password: String!
			$name: String!
			$lastname: String!
			$direction: String!
		) {
			createUser(
				email: $email
				password: $password
				name: $name
				lastname: $lastname
				direction: $direction
			) {
				error
				message
			}
		}
	`,
	addDevice: gql`
		mutation($info: String!) {
			addDevice(info: $info) {
				error
				message
			}
		}
	`,
	editDevice: gql`
		mutation($info: String!) {
			editDevice(info: $info) {
				error
			}
		}
	`,
	removeDevice: gql`
		mutation($idDB: Float!) {
			removeDevice(idDB: $idDB) {
				error
			}
		}
	`,
	updateProfile: gql`
		mutation(
			$name: String!
			$lastname: String!
			$password: String
			$email: String!
			$oldPassword: String
			$direction: String!
		) {
			updateUser(
				name: $name
				lastname: $lastname
				password: $password
				email: $email
				oldPassword: $oldPassword
				direction: $direction
			) {
				error
				message
			}
		}
	`,
	getRecordsDevice: gql`
		mutation(
			$topic: String!
			$hour: Int!
			$day: Int!
			$month: Int!
			$year: Int!
		) {
			getData(
				topic: $topic
				hour: $hour
				month: $month
				day: $day
				year: $year
			) {
				data
				createdAt
				topic
			}
		}
	`,
	addRule: gql`
		mutation(
			$topic: String!
			$comparison: String!
			$number: Int!
			$msg: String!
			$idDB: Int
			$state: Boolean!
		) {
			addRule(
				topic: $topic
				comparison: $comparison
				number: $number
				message: $msg
				idDB: $idDB
				state: $state
			) {
				error
				message
			}
		}
	`,
	removeRule: gql`
		mutation($id: Int!) {
			deleteRule(idDB: $id) {
				error
			}
		}
	`,
	setToken: gql`
		mutation($token: String!, $chatId: String!) {
			addToken(token: $token, chatId: $chatId) {
				error
			}
		}
	`,
	toggleEnabledTelegram: gql`
		mutation($token: String, $chatId: String, $enabled: Boolean) {
			toggleEnabledTelegram(token: $token, chatId: $chatId, enabled: $enabled) {
				error
			}
		}
	`,
};

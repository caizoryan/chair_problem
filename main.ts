
let DEBUG = false
let rounds = 0

type Maybe<T> = T | undefined
type Chair = "one" | "two" | "three"
let available_chairs: Chair[] = ["one", "two", "three"]
const debug = (...args) => DEBUG ? console.log(...args) : null

class Person {
	speak_to: Person[] = []
	listen_to: Person[] = []
	name: string

	constructor(name: string) {
		this.name = name
	}

	add_to_list(people: Person[]) {
		people.forEach((person) => {
			if (person != this) {
				this.speak_to.push(person);
				this.listen_to.push(person)
			}
		})
	}

	spoke_to(person: Person, chair: Maybe<string>) {
		let index = this.speak_to.indexOf(person)
		if (index != -1) this.speak_to.splice(index, 1)
		else return

		person.listened_to(this, chair)
		debug(this.name, "speaks to", person.name)
	}

	listened_to(person: Person, chair: Maybe<string>) {
		let index = this.listen_to.indexOf(person)
		if (index != -1) this.listen_to.splice(index, 1)
		else return

		person.spoke_to(this, chair)
		debug(this.name, " listens to ", person.name, chair ? " sitting on chair: " + chair : "")
		console.log(this.name, " <--> ", person.name, chair ? " ( " + chair + ")" : "")
	}

	find_to_listen(available: Person[]) {
		let found = this.listen_to.find((person) => available.includes(person))
		if (!found) return null
		debug(this.name, " found ", found.name, " to speak to")
		return found
	}
	find_to_speak(available: Person[]) {
		let found = this.speak_to.find((person) => available.includes(person))
		if (!found) return null
		debug(this.name, " found ", found.name, " to listen to")
		return found
	}

	print_speak_to() {
		const names = this.speak_to.map((person) => person.name).join(", ")
		console.log(names)
	}

	done() {
		return (this.speak_to.length == 0 && this.listen_to.length == 0)
	}
}

let available_people: Person[] = [
	new Person("aaryan"),
	new Person("amir"),
	new Person("omama"),
	new Person("sanchari"),
	new Person("anisha")
]

available_people.forEach((person) => person.add_to_list(available_people))

type conversation = {
	speaking: Person,
	listening: Person,
	chair: Chair
}

function pair_up(people: Person[]) {
	let listener: Maybe<Person> = undefined;
	let speaker: Maybe<Person> = undefined;

	people.forEach((person) => {
		let found_speaker = person.find_to_listen(people)
		if (found_speaker) {
			listener = person
			speaker = found_speaker
		}
	})

	if (listener && speaker) {
		return { listener, speaker }
	}
}

function round() {
	debug("ROUND: ", rounds)
	console.log("ROUND: ", rounds)
	const round_available = [...available_people]

	available_chairs.forEach((chair) => {
		debug("trying to pair people", round_available.map((e) => e.name).join(", "))
		let pair = pair_up(round_available)
		if (pair?.listener && pair?.speaker) {
			// remove listener and speaker from available
			let index_of_listener = round_available.indexOf(pair.listener)
			let removed_listener = round_available.splice(index_of_listener, 1)

			let index_of_speaker = round_available.indexOf(pair.speaker)
			let removed_speaker = round_available.splice(index_of_speaker, 1)

			debug("removed: ", removed_speaker[0]?.name, removed_listener[0]?.name)
			// make them speak on chair
			pair.speaker.spoke_to(pair.listener, chair)
		}

	})

	available_people = available_people.filter((person) => !person.done())
	rounds++
}

let count = 500
while (available_people.length > 0) {
	if (count <= 0) { console.log("FUCK"); break; }
	round()
	count--
}

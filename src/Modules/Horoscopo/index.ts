import { Args, Module } from '../ModulesRegister';
import fs from 'fs/promises';
import axios from 'axios';
import Logger from '../Logger/Logger';
import { EntityTypes } from '../../BigData/JsonDB';
import { Message } from '@open-wa/wa-automate';
import { normalizeString } from 'src/Helpers/TextFormatter';

class Horoscopo extends Module {
	logger: Logger;
	constructor() {
		super();
		this.logger = new Logger();

		this.registerPublicMethod({
			name: 'default',
			method: (args, message) => this.default(args, message),
		});
	}

	async default(args: Args, requester: Message) {
		const signo = normalizeString(args.method);

		try {
			if (!requester.id.startsWith('Debug')) {
				this.logger.insertNew(EntityTypes.HOROSCOPE, {
					groupName: requester.isGroupMsg ? requester.chat.name : '_',
					chatId: requester.chatId,
					requester: requester.sender.formattedName,
					sign: signo,
					date: new Date().getTime(),
				});
			}

			const resp = await axios.get(`https://horoscopefree.herokuapp.com/daily/pt/`);

			switch (signo) {
				case 'aries':
					return this.zaplify?.replyAuthor(`${resp.data.aries}`, requester);
				case 'touro':
					return this.zaplify?.replyAuthor(`${resp.data.taurus}`, requester);
				case 'gemeos':
					return this.zaplify?.replyAuthor(`${resp.data.gemini}`, requester);
				case 'cancer':
				case 'câncer':
					return this.zaplify?.replyAuthor(`${resp.data.cancer}`, requester);
				case 'leao':
					return this.zaplify?.replyAuthor(`${resp.data.leo}`, requester);
				case 'escorpiao':
					return this.zaplify?.replyAuthor(`${resp.data.scorpio}`, requester);
				case 'libra':
					return this.zaplify?.replyAuthor(`${resp.data.libra}`, requester);
				case 'sagitario':
					return this.zaplify?.replyAuthor(`${resp.data.sagittarius}`, requester);
				case 'capricornio':
					return this.zaplify?.replyAuthor(`${resp.data.capricorn}`, requester);
				case 'aquario':
					return this.zaplify?.replyAuthor(`${resp.data.aquarius}`, requester);
				case 'peixes':
					return this.zaplify?.replyAuthor(`${resp.data.pisces}`, requester);
				case 'virgem':
					return this.zaplify?.replyAuthor(`${resp.data.virgo}`, requester);
				default:
					return this.sendInstructions(requester);
			}
		} catch (e) {
			this.zaplify?.replyAuthor(
				'Erro ao pesquisar seu horóscopo, tente novamente mais tarde',
				requester
			);
		}
	}

	async sendInstructions(requester: Message) {
		return fs
			.readFile('src/Modules/Horoscopo/Help.txt', {
				encoding: 'utf-8',
			})
			.then(helpText => {
				this.zaplify?.replyAuthor(helpText, requester);
			});
	}
}

export default Horoscopo;

import { compare } from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import runMiddleware from '../../../utils/runMiddleware';
import connectDB from '../../../middleware/connectDB';
import cors from '../../../middleware/cors';
import { sign } from 'jsonwebtoken';
import { User, IUser } from '../../../models';
import { capitalise } from '../../../utils/helpers';
import authenticate from '../../../middleware/authenicate';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	await runMiddleware(req, res, cors);

	if (!req.body) return res.status(400).json({ msg: 'Request Invalid' });

	const {
		id,
		firstName,
		lastName,
		username,
		email,
		phone,
		password,
		passwordConfirm,
		address,
		dateOfBirth,
		aadhar,
		imgUrl,
		youtubeLinks,
		meta,
	} = req.body;

	switch (req.method) {
		case 'POST':
			if (
				!id ||
				!address ||
				!dateOfBirth ||
				!aadhar ||
				!imgUrl ||
				!youtubeLinks ||
				!meta
			)
				return res
					.status(400)
					.json({ msg: 'Please enter all the required fields' });

			try {
				const usr = await User.findById(id).select('id password');
				compare(password, usr.password, async (err: any, obj: any) => {
					if (!err && obj) {
						const updatedUsr = await User.findByIdAndUpdate(usr.id, {
							address,
							dateOfBirth,
							aadhar,
							imgUrl,
							youtubeLinks,
							meta,
						}).select(
							'address dateOfBirth aadhar imgUrl youtubeLinks meta.genre meta.events'
						);
						return res.status(200).json({
							msg: 'Profile created successfully',
							data: updatedUsr,
						});
					} else {
						return res.status(401).json({ msg: 'Password invalid' });
					}
				});
			} catch (err: any) {
				console.error('Profile Update Error:', err);
				return res.status(500).json({ msg: 'Something went wrong' });
			}
			break;

		case 'PUT':
			if (
				!id ||
				!firstName ||
				!lastName ||
				!username ||
				!email ||
				!phone ||
				!address ||
				!dateOfBirth ||
				!aadhar ||
				!imgUrl ||
				!youtubeLinks ||
				!meta
			)
				return res
					.status(400)
					.json({ msg: 'Please enter all the required fields' });

			try {
				const usr = await User.findById(id).select('id password');
				compare(password, usr.password, async (err: any, obj: any) => {
					if (!err && obj) {
						const updatedUsr = await User.findByIdAndUpdate(usr.id, {
							firstName,
							lastName,
							username,
							email,
							phone,
							address,
							dateOfBirth,
							aadhar,
							imgUrl,
							youtubeLinks,
							meta,
						}).select(
							'address dateOfBirth aadhar imgUrl youtubeLinks meta.genre meta.events'
						);
						return res.status(200).json({
							msg: 'Profile created successfully',
							data: updatedUsr,
						});
					} else {
						return res.status(401).json({ msg: 'Password invalid' });
					}
				});
			} catch (err: any) {
				console.error('Profile Update Error:', err);
				return res.status(500).json({ msg: 'Something went wrong' });
			}
		default:
			return res.status(405).end('Method Not Allowed'); //Method Not Allowed
	}
};

export default connectDB(authenticate(handler));

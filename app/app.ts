import path from 'path';
import express from 'express';

// Resources
import User from './resources/User';

const app = express();

app.use(express.static(path.resolve(__dirname, '../dist')));

// Bind routes
app.use('/users', User);

app.use((req, res, next) => {
	const error: any = new Error('Not found');
	error.status = 404;
	next(error);
});

app.use((err, req, res, next) => {
	res.status(err.status || 500)

	if (err.restError) {
		res.json({
			status: err.status,
			error: err.message
		});
	} else {
		res.send('Eror 404');
	}
});

export default app;
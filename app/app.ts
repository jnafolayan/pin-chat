import express from 'express';

// Resources
import User from './resources/User';

const app = express();

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
			error: error.message
		});
	} else {
		res.render('error');
	}
});

export default app;
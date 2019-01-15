export default function(status: number, message: string): Error {
	const error: any = new Error(message);
	error.status = status;
	return error;
}
export default function(res: any, status, message: string): Error {
	const error: any = new Error(message);
	error.status = status;
	return error;
}
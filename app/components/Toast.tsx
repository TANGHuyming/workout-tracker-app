export default function Toast({ message, type }: { message: string; type: 'success' | 'error' }) {
    return (
        <div className={`font-semibold fixed bottom-4 right-4 px-4 py-2 rounded shadow-lg text-white ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
            {message}
        </div>
    );
}
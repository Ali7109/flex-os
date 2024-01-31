type TTSProps = {
	setTextToSpeechRequired: (value: boolean) => void;
	setShowTextToSpeechModal: (value: boolean) => void;
};

const TextToSpeechModal = ({
	setTextToSpeechRequired,
	setShowTextToSpeechModal,
}: TTSProps) => {
	return (
		<div className="fixed inset-0 flex justify-center items-center z-30">
			<div className="absolute flex flex-col justify-center items-center text-center min-h-56 md:h-56 h-1/2 md:m-0 m-10 w-auto md:p-10 rounded-xl bg-black z-40">
				<h1 className="text-white w-2/4 md:w-full mb-10">
					Would you like Text-to-Speech{" "}
					<strong className="text-green-500">enabled</strong>?
				</h1>

				<div className="flex flex-col md:flex-row gap-3 justify-around w-2/3 md:w-full text-white mb-5">
					<button
						onClick={() => {
							setTextToSpeechRequired(true);
							setShowTextToSpeechModal(false);
						}}
						className="md:w-1/2 transition bg-green-500 hover:bg-green-600 text-black rounded-xl p-2"
					>
						<strong>Enable</strong> <br></br> (Spacebar key)
					</button>
					<button
						onClick={() => {
							setTextToSpeechRequired(false);
							setShowTextToSpeechModal(false);
						}}
						className="md:w-1/3 bg-white hover:bg-gray-400 text-black rounded-xl p-2"
					>
						<strong>Disable</strong> <br></br> (Esc key)
					</button>
				</div>
			</div>
			<div className="fixed inset-0 h-full w-full bg-black opacity-50 z-20"></div>
		</div>
	);
};

export default TextToSpeechModal;

import React from 'react'
import { BsChevronUp } from 'react-icons/bs'

type EditorFooterProps = {
  handleSubmitCode: () => void
}

const EditorFooter = ({handleSubmitCode}: EditorFooterProps) => {
  return (
    <div className="flex bg-dark-layer-1 absolute bottom-0 z-10 w-full">
      <div className="mx-5 my-[10px] flex justify-between w-full">
        {/* --- Console Button --- */}
        <div className="me-2 flex flex-1 flex-nowrap items-center space-x-4">
          <button className="px-3 py-1.5 font-medium items-center transition-all inline-flex bg-dark-fill-3 text-sm hover:bg-dark-fill-2 text-dark-label-2 rounded-lg ps-3 pe-2">
            Console
            <div className="ms-1 transform transition flex items-center">
              <BsChevronUp className="fill-gray-600 mx-1" />
            </div>
          </button>
        </div>
        {/* --- Run & Submit Buttons --- */}
        <div className="ms-auto flex items-center space-x-4">
          <button className="px-3 py-1.5 text-sm font-medium items-center whitespace-nowrap transition-all focus:outline-none inline-flex bg-dark-fill-3 hover:bg-dark-fill-2 text-dark-label-2 rounded-lg">
            Run
          </button>
          <button className="px-3 py-1.5 text-sm font-medium items-center whitespace-nowrap transition-all focus:outline-none inline-flex bg-dark-green-s hover:bg-green-600 text-dark-label-2 rounded-lg"
            onClick={handleSubmitCode}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditorFooter;
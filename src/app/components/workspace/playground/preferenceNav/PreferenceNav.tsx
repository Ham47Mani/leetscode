import React, { useEffect, useState } from 'react'
import { AiOutlineFullscreen, AiOutlineFullscreenExit, AiOutlineSetting } from 'react-icons/ai'
import { ISetting } from '../Playground'
import SettingsModal from '@/app/components/modal/SettingsModal'

type PreferenceNavProps = {
  settings: ISetting,
  setSettings: React.Dispatch<React.SetStateAction<ISetting>>
}

const PreferenceNav = ({settings, setSettings}: PreferenceNavProps) => {
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  //--- Make Website full screen or not
  const handleFullScreen = () => {
    if (isFullScreen) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
    setIsFullScreen(!isFullScreen);
  }

  useEffect(() => {
    function exitHandler(e: any) {
      if(!document.fullscreenElement) {
        setIsFullScreen(false);
        return;
      }
      setIsFullScreen(true);
    }

    if(document.addEventListener) {
      document.addEventListener("fullscreenchange", exitHandler);
      document.addEventListener("webkitfullscreenchange", exitHandler);
      document.addEventListener("mozfullscreenchange", exitHandler);
      document.addEventListener("MSFullscreenchange", exitHandler);
    }

  }, [isFullScreen]);

  return (
    <div className='flex justify-between items-center bg-dark-layer-2 h-11 w-full'>
      {/* ------ Left Box (Language Button) ------ */}
      <div className="flex items-center text-white">
        <button className='flex cursor-pointer items-center rounded focus:outline-none bg-dark-fill-3 text-dark-label-2 hover:bg-dark-fill-2 px-2 py-1.5 font-medium'>
          <div className="px-1 text-xs text-dark-label-2 dark:text-dark-label-2">JavaScript</div>
        </button>
      </div>
      {/* ------ Right Box (Setting & Full screen icons) ------ */}
      <div className='flex items-center m-2'>
        {/* ------ Setting Icon ------ */}
        <button className='preferenceBtn group' onClick={() => setSettings({...settings, settingsModalIsOpen: true})}>
          {/* --- Icon --- */}
          <div className="preferenceBtn__icon">
            <AiOutlineSetting />
          </div>
          {/* --- Setting Tooltips --- */}
          <div className="preferenceBtn__tooltips">
            Setting
          </div>
        </button>
        {/* ------ Full Screen Icon ------ */}
        <button className='preferenceBtn group' onClick={handleFullScreen}>
          {!isFullScreen ? (
            <>
              {/* --- Icon --- */}
              <div className="preferenceBtn__icon">
                <AiOutlineFullscreen />
              </div>
              {/* --- Setting Tooltips --- */}
              <div className="preferenceBtn__tooltips">
                Full Screen
              </div>
            </>
          ) : (
            <>
              {/* --- Icon --- */}
              <div className="preferenceBtn__icon">
                <AiOutlineFullscreenExit />
              </div>
              {/* --- Setting Tooltips --- */}
              <div className="preferenceBtn__tooltips">
                Exit Full Screen
              </div>
            </>
          )}
        </button>
      </div>

      {/* ------ Setting Modal ------ */}
      {settings.settingsModalIsOpen && <SettingsModal settings={settings} setSettings={setSettings}/>}
    </div>
  )
}

export default PreferenceNav
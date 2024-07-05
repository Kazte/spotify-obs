const PlayingAnimation = () => {
  return (
    <div className='relative flex justify-between w-[13px] h-[13px]'>
      <span className='w-[3px] h-full bg-[#1ED760] rounded-full animate-playing' />
      <span className='w-[3px] h-full bg-[#1ED760] rounded-full animate-playing-2' />
      <span className='w-[3px] h-full bg-[#1ED760] rounded-full animate-playing-3' />
    </div>
  );
};

export default PlayingAnimation;

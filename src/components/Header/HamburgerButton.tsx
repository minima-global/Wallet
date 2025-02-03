import { motion, MotionConfig } from 'framer-motion'

type HamburgerProps = {
  isOpen: boolean
  toggle: () => void
}

const HamburgerButton: React.FC<HamburgerProps> = ({ isOpen, toggle }) => {
  const handleOnClick = (evt: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
    evt.stopPropagation();
    toggle();
  }

  return (
    <div className="relative -mt-1 h-[40px] w-[40px]">
      <div className="absolute -mt-[4px] h-[50px] w-[55px]" onClick={handleOnClick} />
      <div className="absolute left-[-40px] top-[-22px]">
        <MotionConfig
          transition={{
            duration: 0.3,
            ease: 'easeInOut',
          }}
        >
          <motion.button
            initial={false}
            onClick={handleOnClick}
            className="relative h-20 w-20"
            animate={isOpen ? 'open' : 'closed'}
          >
            <motion.span
              style={{
                left: '80%',
                top: '47%',
                x: '-50%',
                y: '-50%',
              }}
              className="absolute h-[1px] w-5 bg-white"
              variants={{
                open: {
                  rotate: ['0deg', '0deg', '45deg'],
                  top: ['47%', '55%', '55%'],
                },
                closed: {
                  rotate: ['45deg', '0deg', '0deg'],
                  top: ['55%', '55%', '47%'],
                },
              }}
            />
            <motion.span
              style={{
                left: '80%',
                top: '55%',
                x: '-50%',
                y: '-50%',
              }}
              className="absolute h-[1px] w-5 bg-white"
              variants={{
                open: {
                  rotate: ['0deg', '0deg', '-45deg'],
                },
                closed: {
                  rotate: ['-45deg', '0deg', '0deg'],
                },
              }}
            />
            <motion.span
              style={{
                left: 'calc(80% + 4px)',
                bottom: '35%',
                x: '-50%',
                y: '-50%',
              }}
              className="absolute h-[1px] w-3 bg-white"
              variants={{
                open: {
                  rotate: ['0deg', '0deg', '45deg'],
                  left: '80%',
                  opacity: 0,
                  bottom: ['35%', '44%', '44%'],
                },
                closed: {
                  rotate: ['45deg', '0deg', '0deg'],
                  left: 'calc(80% + 4px)',
                  bottom: ['44%', '44%', '35%'],
                },
              }}
            />
          </motion.button>
        </MotionConfig>
      </div>
    </div>
  )
}

export default HamburgerButton

import React from 'react';
import styled from 'styled-components';

interface IScrollerProps {
  images: string[];
}

interface IScrollerState {
  index: number;
}

const ImageSequence = styled.div`
  position: absolute;
  margin: 12px;
  padding: 2px 9px;
  background-color: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.09);
  border-radius: 11px;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.54);
  bottom: 0;
  right: 0;
`;

const ScrollerContainer = styled.div`
  overflow: hidden;
  position: relative;
`;

const Container = styled.div<{ width: number }>`
  display: flex;
  height: 100vw;
  width: ${props => props.width}px;

  & > img {
    display: block;
  }
`;

const DivImgProduct = styled.div`
  width: 100vw;
`;

const ImgProduct = styled.img`
  height: 100%;
  width: 100%;
  object-fit: contain;
`;


/**
 * Getting width and height of the browser
 * Source:
 * https://stackoverflow.com/questions/10359003/getting-the-documents-width-and-height#answer-10359125
 */
function getWidthAndHeight() {
  const w = window;
  const d = document;
  const e = d.documentElement;
  const g = d.getElementsByTagName('body')[0];
  const width = w.innerWidth || e.clientWidth || g.clientWidth;
  const height = w.innerHeight || e.clientHeight || g.clientHeight;

  return { width, height };
}

class Scroller extends React.PureComponent<IScrollerProps, IScrollerState> {
  private sliderRef?: HTMLDivElement;
  private movePosition: number = 0;
  private startPosition: number = 0;
  private screenWidth: number = 0;
  private topPosition: number = 0;
  private imageLength: number = 0;

  constructor(props: IScrollerProps) {
    super(props);
    this.state = {
      index: 0,
    };

    const screenWidth = getWidthAndHeight().width;
    this.screenWidth = screenWidth > 768 ? 768 : screenWidth;
    this.imageLength = props.images.length;
  }

  render() {
    const { images } = this.props;
    const widthSlider = this.imageLength * this.screenWidth;

    return (
      <ScrollerContainer>
        <Container
          onTouchStart={this.handleTouchStart}
          onTouchMove={this.handleTouchMove}
          onTouchEnd={this.handleTouchEnd}
          ref={this.setScrollerRef}
          width={widthSlider}
        >
          {images.map((image, index) => (
            <DivImgProduct>
              <ImgProduct key={index} src={image} />
            </DivImgProduct>
          ))}
        </Container>
        <ImageSequence>
          {this.state.index + 1}/{this.imageLength}
        </ImageSequence>
      </ScrollerContainer>
    );
  }

  setScrollerRef = (el: HTMLDivElement) => {
    this.sliderRef = el;
  };

  removeClassName = (el: HTMLElement, className: string) => {
    if (el.classList) {
      el.classList.remove(className);
    } else {
      el.className = el.className.replace(
        new RegExp(`(^|\\b)${className.split(' ').join('|')}(\\b|$)`, 'gi'),
        ' ',
      );
    }
  };

  addClassName = (el: HTMLElement, className: string) => {
    if (el.classList) {
      el.classList.add(className);
    } else {
      el.className += ' ' + className;
    }
  };

  translateContainer(movement: number, animate: boolean = false) {
    const container = this.sliderRef;

    if (container) {
      if (animate) {
        this.addClassName(container, 'animate-slide');
      } else {
        this.removeClassName(container, 'animate-slide');
      }

      let modifiedMovement = movement;
      if (movement < 0) {
        modifiedMovement = 0;
      } else if (movement > (this.imageLength - 1) * this.screenWidth) {
        modifiedMovement = (this.imageLength - 1) * this.screenWidth;
      }

      container.style.transform = `translate3d(${-modifiedMovement}px, 0, 0)`;
    }
  }

  handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    // Original touch position
    this.startPosition = e.touches[0].clientX;
    this.movePosition = e.touches[0].clientX;

    // Get scroll top position
    const doc = document.documentElement;
    const top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
    this.topPosition = top;

    // Disable scroll when sliding the images
    // document.body.style.position = 'fixed';
    // document.body.style.top = `-${top}px`;
  };

  handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const { index } = this.state;

    this.movePosition = e.touches[0].clientX;
    this.translateContainer(
      this.screenWidth * index - this.movePosition + this.startPosition,
    );
  };

  handleTouchEnd = () => {
    const { index } = this.state;
    const movement = this.startPosition - this.movePosition;
    const rangeMovement = this.screenWidth / 3;
    const totalImages = this.imageLength;

    if (Math.abs(movement) > rangeMovement) {
      if (movement > 0 && index < totalImages - 1) {
        this.translateContainer((index + 1) * this.screenWidth, true);
        this.setState({
          index: index + 1,
        });
      } else if (movement < 0 && index > 0) {
        this.translateContainer((index - 1) * this.screenWidth, true);
        this.setState({
          index: index - 1,
        });
      } else {
        this.translateContainer(index * this.screenWidth, true);
      }
    } else {
      this.translateContainer(index * this.screenWidth, true);
    }

    // document.body.style.position = 'static';
    // document.body.style.top = '0';
    window.scrollTo(0, this.topPosition);
  };
}

export default Scroller;

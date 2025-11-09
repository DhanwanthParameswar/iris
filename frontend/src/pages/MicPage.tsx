function MicPage() {
    return (        
<div style={{width: 440, height: 956, background: 'white', overflow: 'hidden', justifyContent: 'center', alignItems: 'center', gap: 10, display: 'inline-flex'}}>
  <div style={{flex: '1 1 0', alignSelf: 'stretch', overflow: 'hidden', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', display: 'inline-flex'}}>
    <div style={{width: 442, height: 921, maxWidth: 896, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'flex'}}>
      <div style={{alignSelf: 'stretch', flex: '1 1 0', paddingLeft: 16, paddingRight: 16, paddingTop: 60, paddingBottom: 60, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
        <div style={{flex: '1 1 0', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 48, display: 'flex'}}>
          <div style={{width: 192, height: 192, position: 'relative', justifyContent: 'center', alignItems: 'center', display: 'inline-flex'}}>
            <div style={{width: 192, height: 192, left: 0, top: 0, position: 'absolute', background: 'rgba(18, 135, 255, 0.10)', borderRadius: 9999}} />
            <div style={{width: 160, height: 160, left: 16, top: 16, position: 'absolute', background: 'rgba(18, 135, 255, 0.20)', borderRadius: 9999}} />
            <div style={{width: 128, height: 128, background: '#1287FF', borderRadius: 9999, justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
              <div style={{flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                <div style={{width: 34, height: 60, outline: '5px white solid', outlineOffset: '-2.50px'}} />
              </div>
            </div>
          </div>
          <div style={{paddingTop: 20, justifyContent: 'center', alignItems: 'flex-start', gap: 24, display: 'inline-flex'}}>
            <div style={{width: 70, height: 70, background: '#E2E8F0', borderRadius: 16, justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
              <div style={{flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                <div style={{width: 32, height: 30, outline: '5px #475569 solid', outlineOffset: '-2.50px'}} />
              </div>
            </div>
            <div style={{width: 70, height: 70, background: '#E2E8F0', borderRadius: 16, justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
              <div style={{flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                <div style={{width: 30, height: 30, outline: '5px #475569 solid', outlineOffset: '-2.50px'}} />
              </div>
            </div>
            <div style={{width: 70, height: 70, background: '#E2E8F0', borderRadius: 16, justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
              <div style={{flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                <div style={{width: 30, height: 30, outline: '5px #475569 solid', outlineOffset: '-2.50px'}} />
              </div>
            </div>
          </div>
          <div style={{flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', display: 'flex'}}>
            <div style={{textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: '#475569', fontSize: 18, fontFamily: 'Poppins', fontWeight: '400', lineHeight: 27, wordWrap: 'break-word'}}>Listening... Speak now</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
    );
}

export default MicPage;
import OmniAural from 'omniaural'

const v4vElementInfoSet = (v4vElementInfo: any) => {
  OmniAural.state.v4vElementInfo.set(v4vElementInfo)
}

OmniAural.addActions({ v4vElementInfoSet })

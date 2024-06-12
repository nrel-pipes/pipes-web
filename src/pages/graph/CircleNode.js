import React, { memo } from 'react';
import { Handle, useStore, Position } from 'reactflow';

export default memo(({ id }) => {
  const label = useStore((s) => {
    const node = s.nodeInternals.get(id);

    if (!node) {
      return null;
    }

    return `${node.label}: ${node.data.name}`;
  });

  const backgroundColor = useStore((s) => {
    const node = s.nodeInternals.get(id);

    if (!node) {
      return null;
    }

    return `${node.style.backgroundColor}`;

  });

  return (
    <>
      <div
        className="wrapper"
        style={{
          backgroundColor: backgroundColor,
          fontSize: 10,
          color: '#000',
          textAlign: 'center'
        }}
      >
        <div className="inner">{label || 'no node connected'}</div>
      </div>
      <Handle
        type="target"
        position={Position.Top}
      />
      <Handle
        type="source"
        position={Position.Bottom}
      />
    </>
  );
});

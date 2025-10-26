import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

export const SkeletonLoader = ({height, borderRadius}: any) => (
  <SkeletonPlaceholder>
    <SkeletonPlaceholder.Item
      height={height}
      borderRadius={borderRadius}
      marginBottom={16}
    />
  </SkeletonPlaceholder>
);

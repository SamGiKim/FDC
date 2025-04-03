<?php
require_once '../config/redis_config.php';

function updateAdminRedisTimestamp($powerplant_id) {
    global $redis;
    
    try {
        if (!$powerplant_id) {
            return false;
        }

        $redisKey = "{$powerplant_id}_admin_updated";
        $currentTime = date('Y-m-d H:i:s');
        
        // Redis 연결 상태 확인
        if (!$redis->ping()) {
            return false;
        }
        
        // 실제 키 설정 시도
        $result = $redis->set($redisKey, $currentTime);
        
        // 설정 후 바로 확인
        $check = $redis->get($redisKey);
        
        return [
            'set_result' => $result,
            'check_value' => $check,
            'key' => $redisKey,
            'time' => $currentTime
        ];
    } catch (Exception $e) {
        return false;
    }
}
?>
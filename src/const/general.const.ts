export const GENERAL = {
  NAME_COMPONENT: '::microservice-schedule::',
  MESSAGE_SUCCEFULL: 'Proceso exitoso',
  STATUS_CREATED: 'Creado',
  EXCEPTION_CODE: {
    REGISTER_CONSULTING: '[ER-RCHS]',
    REGISTER_CLIENT: '[ER-RCCL]',
    REGISTER_SESSION: '[ER-RGSS]',
    CREATE_SECUENCE: '[ER-CRSC]',
    REGISTER_LOG_CONSULTING: '[ER-RGLC]',
    REGISTER_HOME_CONSULTING: '[ER-RHCG]',
    REGISTER_CALENDAR_CONSULTING: '[ER-RHCC]',
    EXECUTE: '[ER-EXEC]',
  },
  CONSULTING: {
    CODE: 'CONSULTING',
    STATUS: {
      CREATED: 1,
      ATTENDED: 2,
    },
  },
  SESSION: {
    CODE: 'SESSION',
    STATUS: {
      PENDING: 1,
      ATTENDER: 2,
      CANCELED: 3,
    },
  },
  SECUENCES: {
    PROCESS_CODE: 'CONSULTING',
  },
  CLIENT: {
    ACCESS: 'CLIENT_ACCESS',
    LOGS: 'CLIENT_LOGS',
    HOME: 'CLIENT_HOME',
    USER: 'CLIENT_USER'
  },
  JWT: {
    SECRET: 'C0RPST4RTUPB4CK3NDN0D3J',
    ENCRYPT_DECRYPT_SECRET: 'pXJoZtVx1A98r5BSN/PPce9HbDhqQKQySFafIOILHaw=',
  },
};

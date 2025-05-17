"""SECURE PASSWORDS"""
from passlib.context import CryptContext

# Initialize a password context using the bcrypt algorithm
pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")

class Hash:
    """
    A utility class for securely hashing and verifying passwords using bcrypt.

    This class uses the `passlib` library's CryptContext to:
    - Generate secure bcrypt hashes from plain-text passwords.
    - Verify that a provided plain-text password matches a stored bcrypt hash.

    All methods are static, meaning they can be called without creating an instance of the class.

    Example:
        >>> hashed = Hash.bcrypt("my_password")
        >>> Hash.verify("my_password", hashed)
        True
    """

    @staticmethod
    def bcrypt(password: str) -> str:
        """
        Hashes a plain-text password using the bcrypt algorithm.

        :param password: The plain-text password to be hashed.
        :return: A bcrypt-hashed string of the password.
        """
        return pwd_ctx.hash(password)

    @staticmethod
    def verify(plain_password: str, hashed_password: str) -> bool:
        """
        Verifies a plain-text password against a stored bcrypt hash.

        :param plain_password: The password provided by the user.
        :param hashed_password: The previously stored bcrypt hash to check against.
        :return: True if the password is correct, False otherwise.
        """
        return pwd_ctx.verify(plain_password, hashed_password)

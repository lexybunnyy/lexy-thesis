/** main.cpp
$ g++ -c main.cpp calculator.cpp 
$ g++ -o hello.out main.o calculator.o 
./hello.out
*/
#include "calculator.h"

using namespace std;

int main()
{
    interpolationMatrixTest();
    interpolationTest();
    //polynomialTest ();
    return 0;
}

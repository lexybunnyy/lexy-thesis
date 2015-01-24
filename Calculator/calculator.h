#include <iostream>
#include <stdio.h>
#include <math.h>
#include <vector>
#include <algorithm>
#define PI 3.14159265

using namespace std;

typedef vector<vector<double> > DMatrix;
typedef vector<double> DArray;

void interpolateMatrix(DArray &x, DMatrix &M);
DArray l(int j, DArray X);
DArray getLagrangePolinomyal(DArray X, DArray Y);
DArray omega(int j, DArray X);
DArray getNewtonPolinomyal(DArray inpX, DArray inpMDiag);
DArray polynomialAddition(DArray P, DArray Q);
DArray polynomialMultiply(DArray P, DArray Q) ;
void polynomialSimplfy(DArray &P);

void getInterpolationMatrix(DArray X, DMatrix Y, DArray &intpX, DMatrix &intpM) ;

void genXSquaredPoints(DArray &X, DMatrix &Y);
void interpolationTest();
bool testNewton(bool logPoly);
bool testLagrange(bool logPoly);
void interpolationMatrixTest();
void manualInterpolationTest();
void manualPolynomialTest();

bool checkEqual(DArray one, DArray two);

void logPolynomial(DArray P, string poliName);
void logVector(DArray P, string vectorName);
void logResult(DArray x, DMatrix M);
void logCalculate(int i, int j, DMatrix M, DArray x);

void getVectorStd(DArray &P, string poliName);
void getPointsStd(DArray &x, DMatrix &M);
